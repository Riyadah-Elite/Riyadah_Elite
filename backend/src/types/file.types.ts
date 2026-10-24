/**
 * @author aliasgarbootwala3@gmial.com
 */

/**
 * Mirrors the `File` model in prisma/schema.prisma. Kept as a plain type so the
 * service/controller layers do not depend on the generated client.
 */
export interface FileRecord {
  id: string;
  userId: string;
  imageUrl: string | null;
  description: string | null;
  fileUrl: string | null;
  gameListingId: string | null;
  tournamentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** What the API returns for a stored file. */
export type FileResponse = FileRecord;

/** Input the service receives after multer has written the temp file. */
export interface UploadFileInput {
  userId: string;
  filePath: string;
  mimeType: string;
  originalName: string;
  description?: string | null;
}

/** Row written to the File table. */
export interface CreateFileInput {
  userId: string;
  imageUrl: string;
  description?: string | null;
  fileUrl?: string | null;
  gameListingId?: string | null;
  tournamentId?: string | null;
}

/** Raw bytes plus their content type, used to stream an image back. */
export interface FileContent {
  buffer: Buffer;
  mimeType: string;
}
