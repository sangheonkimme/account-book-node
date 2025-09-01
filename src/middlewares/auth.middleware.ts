import { Request, Response, NextFunction } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { prisma } from "../prisma/client";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyAccessToken(token);
    console.log("payload >>", payload);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) return res.sendStatus(403);
    req.user = user;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    console.error(err);
    res.sendStatus(403);
  }
};
