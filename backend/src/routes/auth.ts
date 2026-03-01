import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { schemas } from "../validator/schema";
import { prisma } from "../lib/prisma"

const jwtSecret = process.env.JWT_SECRET;
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const validation = schemas.SignupSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: "InvalidInput"
            });
        }

        const { name, email, password, role } = validation.data;

        const hashedPassword = await bcrypt.hash(password, saltRounds || 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                role: role
            }
        });

        return res.status(201).json({
            message: `User created Successfully with id ${user.id}`
        });
    } catch (err) {
        return res.status(500).json({
            error: "InternalServerError"
        });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const validation = schemas.LoginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: "InvalidInput"
            });
        }

        const { email, password } = validation.data;
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "InvalidCredentials"
            });
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                error: "InvalidUser"
            });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret as string);

        return res.status(200).json({
            token
        });

    } catch (err) {
        return res.status(500).json({
            error: "InternalServerError"
        });
    }
});

export default router;