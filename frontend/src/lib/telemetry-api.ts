import { api } from './api';
import type {
  ApiEnvelope,
  BugReportItem,
  BugReportPage,
  BugReportStatus,
  CategoryItem,
  CreateBugReportPayload,
  CreateGameListingPayload,
  GameListingItem,
  GameListingPage,
} from './types';

export async function fetchCategoriesRequest(): Promise<CategoryItem[]> {
  const { data } = await api.get<ApiEnvelope<{ categories: CategoryItem[] }>>('/api/v1/category');
  return data.data?.categories ?? [];
}

export async function createCategoryRequest(categoryName: string): Promise<CategoryItem> {
  const { data } = await api.post<ApiEnvelope<{ category: CategoryItem }>>('/api/v1/category', {
    categoryName,
  });
  return data.data.category;
}

export async function fetchTrackedUsersRequest(params?: {
  page?: number;
  limit?: number;
  search?: string;
  testingStatus?: string;
}): Promise<any> {
  const { data } = await api.get<ApiEnvelope<any>>('/api/v1/org/users', { params });
  return data.data;
}

export async function fetchGameListingsRequest(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  platform?: string;
  categoryId?: string;
}): Promise<GameListingPage> {
  const { data } = await api.get<ApiEnvelope<GameListingPage>>('/api/v1/listing', { params });
  return data.data;
}

export async function createGameListingRequest(
  payload: CreateGameListingPayload,
): Promise<GameListingItem> {
  const { data } = await api.post<ApiEnvelope<{ listing: GameListingItem }>>(
    '/api/v1/listing',
    payload,
  );
  return data.data.listing;
}

export async function updateGameListingRequest(
  listingId: string,
  payload: Partial<CreateGameListingPayload>,
): Promise<GameListingItem> {
  const { data } = await api.patch<ApiEnvelope<{ listing: GameListingItem }>>(
    `/api/v1/listing/${listingId}`,
    payload,
  );
  return data.data.listing;
}

export async function deleteGameListingRequest(listingId: string): Promise<void> {
  await api.delete(`/api/v1/listing/${listingId}`);
}

export async function joinGameListingRequest(listingId: string): Promise<{ id: string }> {
  const { data } = await api.post<ApiEnvelope<{ enrollment: { id: string } }>>(
    `/api/v1/joinlisting/game/${listingId}`,
  );
  return data.data.enrollment;
}

export interface UserEnrollment {
  joinId?: string;
  id?: string;
  listingId?: string;
  gameListingId?: string;
  type?: string;
  name?: string;
  status?: string;
}

export async function fetchUserEnrollmentsRequest(): Promise<UserEnrollment[]> {
  const { data } = await api.get<ApiEnvelope<{ enrollments: UserEnrollment[] }>>(
    '/api/v1/joinlisting',
  );
  const raw = data.data?.enrollments ?? [];
  return raw.map((e) => ({
    ...e,
    id: e.joinId || e.id,
    gameListingId: e.gameListingId || (e.type === 'game' ? e.listingId : undefined) || e.listingId,
  }));
}

export async function fetchBugReportsRequest(params?: {
  page?: number;
  limit?: number;
  gameListingId?: string;
  status?: BugReportStatus;
  search?: string;
}): Promise<BugReportPage> {
  const { data } = await api.get<ApiEnvelope<BugReportPage>>('/api/v1/bug/report', { params });
  return data.data;
}

export async function createBugReportRequest(
  payload: CreateBugReportPayload,
): Promise<BugReportItem> {
  const { data } = await api.post<ApiEnvelope<{ bugReport: BugReportItem }>>(
    '/api/v1/bug/report',
    payload,
  );
  return data.data.bugReport;
}

export async function updateBugReportStatusRequest(
  bugId: string,
  status: BugReportStatus,
): Promise<{ bugReport: BugReportItem }> {
  const { data } = await api.patch<ApiEnvelope<{ bugReport: BugReportItem }>>(
    `/api/v1/bug/report/${bugId}/status`,
    { status },
  );
  return data.data;
}

export async function uploadScreenshotRequest(
  imageUri: string,
  fileName: string,
  mimeType: string,
  description?: string,
  fileObj?: File,
): Promise<{ id: string; imageUrl: string }> {
  const formData = new FormData();
  if (fileObj) {
    formData.append('image', fileObj, fileName);
  } else {
    formData.append(
      'image',
      {
        uri: imageUri,
        name: fileName,
        type: mimeType,
      } as unknown as Blob,
    );
  }
  if (description) {
    formData.append('description', description);
  }

  const { data } = await api.post<ApiEnvelope<{ file: { id: string; imageUrl: string } }>>(
    '/api/v1/file',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data.data.file;
}
