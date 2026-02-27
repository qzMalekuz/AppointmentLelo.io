import { Router, type Request, type Response } from "express";
import { schemas } from "../validator/schema";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middlewares/authMiddleware";
import { string } from "zod";

const router = Router();

router.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const validation = schemas.CreateServiceSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: "InvalidInput"
            });
        }

        const { name, type, durationMinutes } = validation.data;

        if (req.user?.role !== "SERVICE_PROVIDER") {
            return res.status(403).json({
                error: "Forbidden (wrong role)"
            });
        }

        if (durationMinutes < 30 || durationMinutes > 120 || durationMinutes % 30 !== 0) {
            return res.status(400).json({
                error: "InvalidInput"
            });
        }

        const service = await prisma.service.create({
            data: {
                name,
                type,
                durationMinutes,
                providerId: req.user.userId
            }
        });

        return res.status(201).json({
            id: service.id,
            name: service.name,
            type: service.type,
            durationMinutes: service.durationMinutes
        });

    } catch (err) {
        return res.status(500).json({
            error: "InternalServerError"
        });
    }
});

router.post('/:serviceId/availability', authMiddleware, async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "SERVICE_PROVIDER") {
            return res.status(403).json({
                error: "Forbidden"
            });
        }

        const validation = schemas.SetAvailabilitySchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: "InvalidInput"
            });
        }

        const serviceId = req.params.serviceId as string;
        const { dayOfWeek, startTime, endTime } = validation.data;

        if (startTime >= endTime) {
            return res.status(400).json({
                error: "InvalidTimeRange"
            });
        }

        const service = await prisma.service.findUnique({ where: { id: serviceId } });

        if (!service) {
            return res.status(404).json({ error: "ServiceNotFound" });
        }

        if (service.providerId !== req.user.userId) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const daysEnumMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayEnumString = daysEnumMap[dayOfWeek];

        // Ensure no overlapping availability for the SAME day
        const existingAvailabilities = await prisma.availability.findMany({
            where: {
                serviceId,
                dayOfWeek: dayEnumString as any // Need 'any' or proper import
            }
        });

        for (const avail of existingAvailabilities) {
            if ((startTime >= avail.startTime && startTime < avail.endTime) ||
                (endTime > avail.startTime && endTime <= avail.endTime) ||
                (startTime <= avail.startTime && endTime >= avail.endTime)) {
                return res.status(409).json({ error: "Overlapping availability" });
            }
        }

        await prisma.availability.create({
            data: {
                serviceId,
                dayOfWeek: dayEnumString as any,
                startTime,
                endTime
            }
        });

        return res.status(201).json({});

    } catch (err) {
        return res.status(500).json({
            error: "InternalServerError"
        });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const validation = schemas.QueryServicesSchema.safeParse(req.query);
        if (!validation.success) {
            return res.status(400).json({ error: "InvalidInput" });
        }

        const { type } = validation.data;
        const whereClause = type ? { type } : {};

        const services = await prisma.service.findMany({
            where: whereClause,
            include: {
                provider: {
                    select: { name: true }
                }
            }
        });

        const formattedServices = services.map(s => ({
            id: s.id,
            name: s.name,
            type: s.type,
            durationMinutes: s.durationMinutes,
            providerName: s.provider.name
        }));

        return res.status(200).json(formattedServices);
    } catch (err) {
        return res.status(500).json({ error: "InternalServerError" });
    }
});

function addMinutes(time: string, mins: number): string {
    const parts = time.split(':');
    const h = parseInt(parts[0] || "0", 10);
    const m = parseInt(parts[1] || "0", 10);
    const totalMins = h * 60 + m + mins;
    const newH = Math.floor(totalMins / 60);
    const newM = totalMins % 60;
    return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
}

router.get('/:serviceId/slots', async (req: Request, res: Response) => {
    try {
        const validation = schemas.GetSlotsSchema.safeParse(req.query);
        if (!validation.success) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        const { date } = validation.data;
        const serviceId = req.params.serviceId as string;

        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({ error: "Invalid date" });
        }

        // Check if date is in the past (using locale string to handle timezone issues simply for this context, or simple comparison)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dateObj < today) {
            // Depending on strictness, returning empty slots or error. Let's return empty slots or error? 
            // "Booking past dates or times is forbidden" -> so we shouldn't show slots.
            return res.status(200).json({ serviceId, date, slots: [] });
        }

        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            include: { availability: true }
        });

        if (!service) {
            return res.status(404).json({ error: "ServiceNotFound" });
        }

        const daysEnumMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayOfWeekString = daysEnumMap[dateObj.getDay()];

        const availabilities = service.availability.filter((a: any) => a.dayOfWeek === dayOfWeekString);

        if (availabilities.length === 0) {
            return res.status(200).json({ serviceId, date, slots: [] });
        }

        // Get booked appointments for this date
        // Note: appointment.date is Date in Prisma. We need to query from start of day to end of day.
        const nextDay = new Date(dateObj);
        nextDay.setDate(nextDay.getDate() + 1);

        const bookedAppointments = await prisma.appointment.findMany({
            where: {
                serviceId,
                date: {
                    gte: dateObj,
                    lt: nextDay
                },
                status: 'BOOKED'
            }
        });

        const bookedSlotIds = new Set(bookedAppointments.map(a => a.slotId));
        const slots: any[] = [];

        const now = new Date();
        const isToday = dateObj.getTime() === today.getTime();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

        for (const avail of availabilities) {
            let currentSlotStart = avail.startTime;

            while (true) {
                const nextSlotEnd = addMinutes(currentSlotStart, service.durationMinutes);
                if (nextSlotEnd > avail.endTime) {
                    break;
                }

                // If today, only show slots in the future
                if (!isToday || currentSlotStart > currentTimeString) {
                    const slotId = `${serviceId}_${date}_${currentSlotStart}`;
                    if (!bookedSlotIds.has(slotId)) {
                        slots.push({
                            slotId,
                            startTime: currentSlotStart,
                            endTime: nextSlotEnd
                        });
                    }
                }

                currentSlotStart = nextSlotEnd;
            }
        }

        return res.status(200).json({
            serviceId,
            date,
            slots
        });

    } catch (err) {
        return res.status(500).json({ error: "InternalServerError" });
    }
});

export default router;