import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const jwtSecret = process.env.JWT_SECRET;

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {

    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }

        const parts = header.split(' ');

        if(parts.length !== 2 || parts[0] !== 'Bearer' ||parts[1] == undefined) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        const token = parts[1];
        const decoded = jwt.verify(token, jwtSecret as string) as JwtPayload;

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "User not found"
            });
        }

        req.user = {
            userId: decoded.userId,
            role: decoded.role as string
        }
        next();
        
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        })
    }
}