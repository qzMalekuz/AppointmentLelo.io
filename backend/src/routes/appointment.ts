import { Router, type Request, type Response } from "express";
import { schemas } from "../validator/schema";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();


function addMinutes(time: string, mins: number): string {
    const parts = time.split(':');
    const h = parseInt(parts[0] || "0", 10);
    const m = parseInt(parts[1] || "0", 10);
    const totalMins = h * 60 + m + mins;
    const newH = Math.floor(totalMins / 60);
    const newM = totalMins % 60;
    return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
}

router.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "USER") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const validation = schemas.BookAppointmentSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: "InvalidInput" });
        }

        const { slotId } = validation.data;
        const parts = slotId.split('_');
        if (parts.length !== 3) {
            return res.status(400).json({ error: "Invalid slotId format" });
        }

        const serviceId = parts[0] as string;
        const dateStr = parts[1] as string;
        const startTime = parts[2] as string;

        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({ error: "Invalid date in slotId" });
        }

        // Basic past booking prevention
        const now = new Date();
        const bookingDateTime = new Date(dateStr);
        const [hours, minutes] = startTime.split(':').map(Number);
        bookingDateTime.setHours(hours ?? 0, minutes ?? 0, 0, 0);

        if (bookingDateTime < now) {
            return res.status(400).json({ error: "Cannot book appointments in the past" });
        }

        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            include: { availability: true }
        });

        if (!service) {
            return res.status(404).json({ error: "ServiceNotFound" });
        }

        if (service.providerId === req.user.userId) {
            return res.status(403).json({ error: "Forbidden (You cannot book your own service)" });
        }

        const daysEnumMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayOfWeekString = daysEnumMap[dateObj.getDay()];

        const availabilities = service.availability.filter((a: any) => a.dayOfWeek === dayOfWeekString);
        let isValidTime = false;

        const endTime = addMinutes(startTime, service.durationMinutes);

        for (const avail of availabilities) {
            if (startTime >= avail.startTime && endTime <= avail.endTime) {
                // Check if aligned to slots (starts from availability startTime or in increments)
                let currentSlot = avail.startTime;
                while (currentSlot < avail.endTime) {
                    if (currentSlot === startTime) {
                        isValidTime = true;
                        break;
                    }
                    currentSlot = addMinutes(currentSlot, service.durationMinutes);
                }
                if (isValidTime) break;
            }
        }

        if (!isValidTime) {
            return res.status(400).json({ error: "Invalid time for slot" });
        }

        // Check if existing appointment
        const existing = await prisma.appointment.findUnique({
            where: { slotId }
        });

        if (existing) {
            return res.status(409).json({ error: "Slot already booked" });
        }

        const appointment = await prisma.$transaction(async (tx: any) => {
            return tx.appointment.create({
                data: {
                    userId: req.user!.userId,
                    serviceId,
                    date: dateObj,
                    startTime,
                    endTime,
                    slotId,
                    status: 'BOOKED'
                }
            });
        });

        return res.status(201).json({
            id: appointment.id,
            slotId: appointment.slotId,
            status: appointment.status
        });

    } catch (err) {
        return res.status(500).json({ error: "InternalServerError" });
    }
});

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "USER") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const appointments = await prisma.appointment.findMany({
            where: { userId: req.user.userId },
            include: { service: true }
        });

        const formatted = appointments.map((a: any) => {
            const dateStr = a.date.toISOString().split('T')[0];
            return {
                serviceName: a.service.name,
                type: a.service.type,
                date: dateStr,
                startTime: a.startTime,
                endTime: a.endTime,
                status: a.status
            };
        });

        return res.status(200).json(formatted);

    } catch (err) {
        return res.status(500).json({ error: "InternalServerError" });
    }
});

export default router;