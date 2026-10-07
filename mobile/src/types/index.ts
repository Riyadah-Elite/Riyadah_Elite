export type Role = "PLAYER" | "DEVELOPER" | "HOST" | "ADMIN";

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: Role;
  isVerified: boolean;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface GameOpportunity {
  id: string;
  slug: string;
  title: string;
  studio: string;
  genre: string;
  platform: string;
  stage: string;
  version: string;
  description: string;
  rewardText?: string | null;
  imageUrl?: string | null;
  status: string;
  createdAt: string;
  _count?: {
    applications: number;
  };
}

export interface Tournament {
  id: string;
  slug: string;
  title: string;
  game: string;
  organizer: string;
  format: string;
  bracketType: string;
  platform: string;
  region: string;
  prizePool?: string | null;
  entryFee?: string | null;
  maxParticipants: number;
  participantCount?: number;
  startDate: string;
  status: string;
  bannerUrl?: string | null;
}

export interface ApiResponse<T = unknown> {
  status: "ok" | "error";
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}
