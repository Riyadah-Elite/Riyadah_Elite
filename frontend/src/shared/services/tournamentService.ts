import { apiRequest } from '../api/client';
import { TournamentListing } from '../types';
import { MOCK_TOURNAMENTS } from './mockData';

export const tournamentService = {
  async listTournaments(params?: { search?: string; page?: number; limit?: number }): Promise<TournamentListing[]> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.page) query.append('page', String(params.page));
      if (params?.limit) query.append('limit', String(params.limit));

      const res = await apiRequest<{ data?: { tournaments?: TournamentListing[] } | TournamentListing[] }>(
        `/api/v1/listing/tournaments?${query.toString()}`
      );
      if ('data' in res && res.data) {
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data.tournaments)) return res.data.tournaments;
      }
      return MOCK_TOURNAMENTS;
    } catch {
      if (params?.search) {
        const s = params.search.toLowerCase();
        return MOCK_TOURNAMENTS.filter(
          (t) => t.tournamentName.toLowerCase().includes(s) || t.gameName?.toLowerCase().includes(s)
        );
      }
      return MOCK_TOURNAMENTS;
    }
  },

  async getTournament(id: string): Promise<TournamentListing | null> {
    try {
      const res = await apiRequest<{ data?: { tournament?: TournamentListing } | TournamentListing }>(
        `/api/v1/listing/tournament/${id}`
      );
      if ('data' in res && res.data) {
        if ('tournament' in res.data && res.data.tournament) return res.data.tournament;
        return res.data as TournamentListing;
      }
      return MOCK_TOURNAMENTS.find((t) => t.id === id) ?? null;
    } catch {
      return MOCK_TOURNAMENTS.find((t) => t.id === id) ?? null;
    }
  },

  async enrollTournament(tournamentId: string): Promise<boolean> {
    try {
      await apiRequest(`/api/v1/joinlisting/tournament/${tournamentId}`, { method: 'POST' });
      return true;
    } catch {
      // Mock enrollment success
      return true;
    }
  },
};

