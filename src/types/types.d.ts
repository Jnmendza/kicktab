import { PrismaClient } from "@prisma/client";

declare global {
  let prisma: PrismaClient | undefined;
}

export type FavoriteTeam = {
  teamId: number;
  id?: number;
  teamCode: string;
  createdAt?: string;
  userId?: string | null;
};

export type League = {
  id: number;
  type: string;
  name: string;
  country: string;
  flagUrl: string;
  logoUrl: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
};
