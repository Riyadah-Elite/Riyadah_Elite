import { apiRequest } from '../api/client';
import { BugReport } from '../types';
import { MOCK_BUGS } from './mockData';

export interface CreateBugPayload {
  gameListingId: string;
  bugDescription: string;
  reproSteps?: string[];
  severity?: string;
  imageId?: string;
  fileId?: string;
}

export const bugService = {
  async listReports(params?: { gameListingId?: string; status?: string }): Promise<BugReport[]> {
    try {
      const query = new URLSearchParams();
      if (params?.gameListingId) query.append('gameListingId', params.gameListingId);
      if (params?.status) query.append('status', params.status);

      const res = await apiRequest<{ data?: { bugReports?: BugReport[] } | BugReport[] }>(
        `/api/v1/bug/report?${query.toString()}`
      );
      if ('data' in res && res.data) {
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data.bugReports)) return res.data.bugReports;
      }
      return MOCK_BUGS;
    } catch {
      return MOCK_BUGS;
    }
  },

  async createReport(payload: CreateBugPayload): Promise<BugReport> {
    try {
      const res = await apiRequest<{ data?: { bugReport?: BugReport } | BugReport }>(
        '/api/v1/bug/report',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );
      if ('data' in res && res.data) {
        if ('bugReport' in res.data && res.data.bugReport) return res.data.bugReport;
        return res.data as BugReport;
      }
      throw new Error('Invalid response');
    } catch {
      const mockCreated: BugReport = {
        id: `bug-${Date.now()}`,
        userId: 'current-user',
        userName: 'CurrentTester',
        gameListingId: payload.gameListingId,
        bugDescription: payload.bugDescription,
        reproSteps: payload.reproSteps,
        severity: (payload.severity as BugReport['severity']) || 'major',
        status: 'open',
        createdAt: new Date().toISOString(),
      };
      return mockCreated;
    }
  },
};

