import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { z } from 'zod';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, role } = registerSchema.parse(req.body);
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, phone, role }
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'strict' });
    res.json({ accessToken });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
