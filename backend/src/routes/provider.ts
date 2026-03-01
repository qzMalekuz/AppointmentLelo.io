import { Router, type Request, type Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middlewares/authMiddleware";
import { schemas } from "../validator/schema";

const router = Router();

router.get('/me/schedule', authMiddleware, async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== "SERVICE_PROVIDER") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const dateStr = req.query.date as string;
        const validation = schemas.GetSlotsSchema.safeParse({ date: dateStr });
        if (!validation.success) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        const { date } = validation.data;
        const dateObj = new Date(date);

        const nextDay = new Date(dateObj);
        nextDay.setDate(nextDay.getDate() + 1);

        const providerId = req.user.userId;

        const services = await prisma.service.findMany({
            where: { providerId },
            include: {
                appointments: {
                    where: {
                        date: {
                            gte: dateObj,
                            lt: nextDay
                        },
                        status: 'BOOKED'
                    },
                    orderBy: {
                        startTime: 'asc'
                    },
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                }
            }
        });

        const formattedServices = services.map(s => {
            return {
                serviceId: s.id,
                serviceName: s.name,
                appointments: s.appointments.map(a => ({
                    appointmentId: a.id,
                    userName: a.user.name,
                    startTime: a.startTime,
                    endTime: a.endTime,
                    status: a.status
                }))
            };
        });

        return res.status(200).json({
            date,
            services: formattedServices
        });

    } catch (err) {
        return res.status(500).json({ error: "InternalServerError" });
    }
});

export default router;
