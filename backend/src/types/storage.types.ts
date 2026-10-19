export interface IStorage {
  put(
    key: string,
    filePath: string,
    mimeType: string,
  ): Promise<{ url: string; buffer: Buffer }>;

  get(key: string): Promise<{
    buffer: Buffer;
    mimeType: string;
  }>;
}