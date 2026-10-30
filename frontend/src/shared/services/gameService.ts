import { apiRequest } from '../api/client';
import { GameListing } from '../types';
import { MOCK_GAMES } from './mockData';

export const gameService = {
  async listGames(params?: { search?: string; category?: string; page?: number; limit?: number }): Promise<GameListing[]> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.category) query.append('category', params.category);
      if (params?.page) query.append('page', String(params.page));
      if (params?.limit) query.append('limit', String(params.limit));

      const res = await apiRequest<{ data?: { listings?: GameListing[] } | GameListing[] }>(
        `/api/v1/listing?${query.toString()}`
      );
      if ('data' in res && res.data) {
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data.listings)) return res.data.listings;
      }
      return MOCK_GAMES;
    } catch {
      if (params?.search) {
        const s = params.search.toLowerCase();
        return MOCK_GAMES.filter(
          (g) => g.gameName.toLowerCase().includes(s) || g.description?.toLowerCase().includes(s)
        );
      }
      return MOCK_GAMES;
    }
  },

  async getGame(id: string): Promise<GameListing | null> {
    try {
      const res = await apiRequest<{ data?: { listing?: GameListing } | GameListing }>(
        `/api/v1/listing/${id}`
      );
      if ('data' in res && res.data) {
        if ('listing' in res.data && res.data.listing) return res.data.listing;
        return res.data as GameListing;
      }
      return MOCK_GAMES.find((g) => g.id === id) ?? null;
    } catch {
      return MOCK_GAMES.find((g) => g.id === id) ?? null;
    }
  },

  async enrollGame(gameId: string): Promise<boolean> {
    try {
      await apiRequest(`/api/v1/joinlisting/game/${gameId}`, { method: 'POST' });
      return true;
    } catch {
      return true;
    }
  },
};

