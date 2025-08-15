import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) return res.sendStatus(403);
    req.user = user;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};
