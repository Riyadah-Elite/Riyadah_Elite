import { api } from './api';
import type {
  ApiEnvelope,
  CreateTournamentPayload,
  GameListingPage,
  TournamentItem,
  TournamentPage,
} from './types';

export interface TournamentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export async function getTournamentsRequest(
  params: TournamentQueryParams = {},
): Promise<TournamentPage> {
  const response = await api.get<ApiEnvelope<TournamentPage>>('/api/v1/tournament', {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      search: params.search?.trim() || undefined,
      status: params.status || undefined,
    },
  });

  return response.data.data;
}

export async function createTournamentRequest(
  payload: CreateTournamentPayload,
): Promise<TournamentItem> {
  const response = await api.post<ApiEnvelope<{ tournament: TournamentItem }>>(
    '/api/v1/tournament',
    payload,
  );

  return response.data.data.tournament;
}

export async function updateTournamentRequest(
  id: string,
  payload: Partial<CreateTournamentPayload>,
): Promise<TournamentItem> {
  const response = await api.patch<ApiEnvelope<{ tournament: TournamentItem }>>(
    `/api/v1/tournament/${id}`,
    payload,
  );

  return response.data.data.tournament;
}

export async function deleteTournamentRequest(id: string): Promise<void> {
  await api.delete(`/api/v1/tournament/${id}`);
}

export async function joinTournamentRequest(
  tournamentId: string,
): Promise<{ id: string; tournamentListingId: string }> {
  const response = await api.post<ApiEnvelope<{ enrollment: { id: string; tournamentListingId: string } }>>(
    `/api/v1/joinlisting/tournament/${tournamentId}`,
  );

  return response.data.data.enrollment;
}

export async function getGamesForTournamentRequest(): Promise<GameListingPage> {
  const response = await api.get<ApiEnvelope<GameListingPage>>('/api/v1/listing', {
    params: { page: 1, limit: 50 },
  });

  return response.data.data;
}

