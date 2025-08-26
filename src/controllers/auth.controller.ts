import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

export const register = async (req: Request, res: Response) => {
  try {
    const { userId, email, password, name, phone } = registerSchema.parse(
      req.body
    );
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { userId, email, password: hashed, name, phone, role: "1" },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const refresh = (req: Request, res: Response) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) return res.status(401).json({ message: "No token" });

  try {
    const payload: any = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(payload.userId);
    res.cookie("accessToken", newAccessToken, { httpOnly: true });
    res.json({ message: "Token refreshed" });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { userId, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    return res.json({ accessToken });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};
