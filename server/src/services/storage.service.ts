import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export type FileCategory = "avatars" | "evidence" | "banners" | "documents";

export interface PresignedUploadResult {
  uploadUrl: string;
  storageKey: string;
  publicUrl: string;
  expiresInSeconds: number;
}

export interface StorageConfig {
  endpoint?: string;
  port?: number;
  accessKey?: string;
  secretKey?: string;
  useSSL?: boolean;
  bucket?: string;
  region?: string;
  publicBaseUrl?: string;
}

export class StorageService {
  private client: S3Client | null = null;
  private bucket: string;
  private endpoint: string;
  private publicBaseUrl: string;
  private enabled: boolean = false;

  constructor(config?: StorageConfig) {
    const endpoint = config?.endpoint ?? process.env.MINIO_ENDPOINT ?? "localhost";
    const port = config?.port ?? parseInt(process.env.MINIO_PORT || "9000", 10);
    const useSSL = config?.useSSL ?? (process.env.MINIO_USE_SSL === "true");
    const accessKey = config?.accessKey ?? process.env.MINIO_ACCESS_KEY ?? "";
    const secretKey = config?.secretKey ?? process.env.MINIO_SECRET_KEY ?? "";
    const bucket = config?.bucket ?? process.env.MINIO_BUCKET ?? "riyadah-media";
    const region = config?.region ?? process.env.MINIO_REGION ?? "us-east-1";

    this.bucket = bucket;

    // Build standard S3/MinIO endpoint URL
    const protocol = useSSL ? "https" : "http";
    const hasPortInEndpoint = endpoint.includes(":") || endpoint.startsWith("http");
    this.endpoint = hasPortInEndpoint
      ? endpoint
      : `${protocol}://${endpoint}:${port}`;

    this.publicBaseUrl =
      config?.publicBaseUrl ??
      process.env.MINIO_PUBLIC_URL ??
      `${this.endpoint}/${this.bucket}`;

    // Only activate S3Client when access keys are present (or fallback to dummy for dev/test)
    if (accessKey && secretKey) {
      this.client = new S3Client({
        endpoint: this.endpoint,
        region,
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
        },
        forcePathStyle: true, // Essential for MinIO path-style bucket naming
      });
      this.enabled = true;
    }
  }

  public isEnabled(): boolean {
    return this.enabled && this.client !== null;
  }

  public generateStorageKey(category: FileCategory, filename: string, userId?: string): string {
    const cleanFilename = filename.toLowerCase().replace(/[^a-z0-9._-]/g, "_");
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 8);
    const userSegment = userId ? `user-${userId}/` : "";
    return `${category}/${userSegment}${timestamp}-${randomHex}-${cleanFilename}`;
  }

  public getPublicUrl(storageKey: string): string {
    return `${this.publicBaseUrl.replace(/\/+$/, "")}/${storageKey.replace(/^\/+/, "")}`;
  }

  public async getPresignedUploadUrl(
    storageKey: string,
    mimeType: string,
    expiresInSeconds: number = 900 // 15 minutes
  ): Promise<PresignedUploadResult> {
    if (!this.client || !this.enabled) {
      // Graceful local emulation when MinIO credentials not yet configured
      return {
        uploadUrl: `${this.endpoint}/${this.bucket}/${storageKey}?mock=true`,
        storageKey,
        publicUrl: this.getPublicUrl(storageKey),
        expiresInSeconds,
      };
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
    return {
      uploadUrl,
      storageKey,
      publicUrl: this.getPublicUrl(storageKey),
      expiresInSeconds,
    };
  }

  public async getPresignedDownloadUrl(
    storageKey: string,
    expiresInSeconds: number = 3600 // 1 hour
  ): Promise<string> {
    if (!this.client || !this.enabled) {
      return this.getPublicUrl(storageKey);
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
    });

    return await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }

  public async deleteFile(storageKey: string): Promise<boolean> {
    if (!this.client || !this.enabled) {
      return true;
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      });
      await this.client.send(command);
      return true;
    } catch (err) {
      console.error(`[STORAGE] Error deleting file key ${storageKey}:`, err);
      return false;
    }
  }

  public async fileExists(storageKey: string): Promise<boolean> {
    if (!this.client || !this.enabled) {
      return false;
    }

    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      });
      await this.client.send(command);
      return true;
    } catch (err: any) {
      if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw err;
    }
  }

  public async checkHealth(): Promise<{ status: "HEALTHY" | "DISABLED" | "UNHEALTHY"; message?: string }> {
    if (!this.isEnabled()) {
      return { status: "DISABLED", message: "Storage credentials not configured" };
    }

    try {
      // Quick check against the S3/MinIO client
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: "healthcheck-probe.txt",
      });
      await this.client!.send(command).catch((err) => {
        // 404 means the bucket and network are reachable, just object doesn't exist (healthy)
        if (err.$metadata?.httpStatusCode === 404 || err.name === "NotFound") {
          return;
        }
        throw err;
      });
      return { status: "HEALTHY" };
    } catch (err: any) {
      return { status: "UNHEALTHY", message: err.message || "Cannot connect to storage bucket" };
    }
  }
}

// Global Singleton Export
export const storageService = new StorageService();
