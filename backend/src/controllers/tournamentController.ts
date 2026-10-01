import { Request, Response } from 'express';

export const getTournaments = async (req: Request, res: Response) => {
  // Database is currently empty as per Zero-Fake-Data policy.
  // In future phases, this will use Prisma to fetch tournaments.
  res.status(200).json({ data: [] });
};
