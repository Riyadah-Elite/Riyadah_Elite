import { Request, Response } from 'express';

export const getGames = async (req: Request, res: Response) => {
  // Database is currently empty as per Zero-Fake-Data policy.
  // In future phases, this will use Prisma to fetch games.
  res.status(200).json({ data: [] });
};
