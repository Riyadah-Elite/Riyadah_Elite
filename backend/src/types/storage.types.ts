export interface IStorage {
  put(key: string, filePath: string, mimeType: string): Promise<string>;

  get(key: string): Promise<{
    buffer: Buffer;
    mimeType: string;
  }>;
}