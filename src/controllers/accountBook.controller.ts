import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import {
  accountBookSchema,
  reorderAccountBookSchema,
  updateAccountBookSchema,
} from "../schemas/accountBook.schema";

export const getMyAccountBooks = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const userId = req.user.userId;
  const data = await prisma.accountBook.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });

  res.json(data);
};

export const createAccountBook = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const validated = accountBookSchema.parse(req.body);

  const maxOrder = await prisma.accountBook.aggregate({
    where: { userId },
    _max: { order: true },
  });

  const data = await prisma.accountBook.create({
    data: { ...validated, userId, order: (maxOrder._max.order ?? 0) + 1 },
  });
  console.log(data);

  res.status(201).json(data);
};

export const updateAccountBook = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const validated = updateAccountBookSchema.parse(req.body);

  const accountBook = await prisma.accountBook.findUnique({
    where: { id: Number(id) },
  });

  if (!accountBook) {
    return res.status(404).json({ message: "Account book not found" });
  }

  if (accountBook.userId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const data = await prisma.accountBook.update({
    where: { id: Number(id) },
    data: { ...validated },
  });

  res.json(data);
};

export const deleteAccountBook = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const accountBook = await prisma.accountBook.findUnique({
    where: { id: Number(id) },
  });

  if (!accountBook) {
    return res.status(404).json({ message: "Account book not found" });
  }

  if (accountBook.userId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await prisma.accountBook.delete({
    where: { id: Number(id) },
  });

  res.status(204).send();
};

export const reorderAccountBooks = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { orderedIds } = reorderAccountBookSchema.parse(req.body);

  const updates = orderedIds.map((id, index) =>
    prisma.accountBook.update({
      where: { id, userId },
      data: { order: index + 1 },
    })
  );

  await prisma.$transaction(updates);

  res.status(200).json({ message: "Reordered successfully" });
};
