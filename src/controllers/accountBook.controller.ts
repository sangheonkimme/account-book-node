import { Request, Response } from 'express';
import { prisma } from '../prisma/client';
import { accountBookSchema } from '../schemas/accountBook.schema';

export const getMyAccountBooks = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const data = await prisma.accountBook.findMany({ where: { userId } });
  res.json(data);
};

export const createAccountBook = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const validated = accountBookSchema.parse(req.body);
  const data = await prisma.accountBook.create({
    data: { ...validated, userId }
  });
  res.status(201).json(data);
};
