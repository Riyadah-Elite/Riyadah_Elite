import { Redis, RedisOptions } from "ioredis";

export interface CacheConfig {
  url?: string;
  host?: string;
  port?: number;
  password?: string;
  tls?: boolean;
}

export class CacheService {
  private client: Redis | null = null;
  private enabled: boolean = false;
  private isConnecting: boolean = false;

  constructor(config?: CacheConfig) {
    const redisUrl = config?.url ?? process.env.REDIS_URL;
    const redisHost = config?.host ?? process.env.REDIS_HOST;
    const redisPort = config?.port ?? parseInt(process.env.REDIS_PORT || "6379", 10);
    const redisPassword = config?.password ?? process.env.REDIS_PASSWORD;

    // Only attempt connection if REDIS_URL or REDIS_HOST is explicitly defined
    if (redisUrl || redisHost) {
      try {
        const options: RedisOptions = {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          retryStrategy: (times) => {
            if (times > 3) {
              return null; // Stop retrying after 3 attempts so server remains responsive
            }
            return Math.min(times * 100, 2000);
          },
        };

        if (redisUrl) {
          this.client = new Redis(redisUrl, options);
        } else {
          this.client = new Redis({
            host: redisHost,
            port: redisPort,
            password: redisPassword,
            ...options,
          });
        }

        this.client.on("connect", () => {
          this.enabled = true;
          this.isConnecting = false;
        });

        this.client.on("error", (err: Error) => {
          // Log warning once, avoid crashing or blocking
          if (this.enabled) {
            console.warn(`[CACHE:REDIS] Connection error: ${err.message}`);
          }
          this.enabled = false;
        });

        this.client.on("close", () => {

          this.enabled = false;
        });

        // Eager initial connect attempt
        this.connect();
      } catch (err: any) {
        console.warn(`[CACHE:REDIS] Failed to initialize Redis client: ${err.message}`);
        this.enabled = false;
      }
    }
  }

  private async connect(): Promise<void> {
    if (!this.client || this.isConnecting || this.enabled) return;
    this.isConnecting = true;
    try {
      await this.client.connect();
      this.enabled = true;
    } catch {
      this.enabled = false;
    } finally {
      this.isConnecting = false;
    }
  }

  public isEnabled(): boolean {
    return this.enabled && this.client !== null && this.client.status === "ready";
  }

  public async get<T>(key: string): Promise<T | null> {
    if (!this.isEnabled()) return null;
    try {
      const data = await this.client!.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  public async set(key: string, value: unknown, ttlSeconds: number = 300): Promise<boolean> {
    if (!this.isEnabled()) return false;
    try {
      const payload = JSON.stringify(value);
      if (ttlSeconds > 0) {
        await this.client!.setex(key, ttlSeconds, payload);
      } else {
        await this.client!.set(key, payload);
      }
      return true;
    } catch {
      return false;
    }
  }

  public async del(keyOrPattern: string): Promise<boolean> {
    if (!this.isEnabled()) return false;
    try {
      if (keyOrPattern.includes("*")) {
        const keys = await this.client!.keys(keyOrPattern);
        if (keys.length > 0) {
          await this.client!.del(...keys);
        }
      } else {
        await this.client!.del(keyOrPattern);
      }
      return true;
    } catch {
      return false;
    }
  }

  public async invalidatePrefix(prefix: string): Promise<boolean> {
    return this.del(`${prefix}:*`);
  }

  public async checkHealth(): Promise<{ status: "HEALTHY" | "DISABLED" | "UNHEALTHY"; message?: string }> {
    if (!this.client) {
      return { status: "DISABLED", message: "Redis not configured" };
    }

    if (!this.isEnabled()) {
      return { status: "UNHEALTHY", message: "Redis client disconnected" };
    }

    try {
      const pong = await this.client.ping();
      return pong === "PONG" ? { status: "HEALTHY" } : { status: "UNHEALTHY", message: `Unexpected ping: ${pong}` };
    } catch (err: any) {
      return { status: "UNHEALTHY", message: err.message };
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        // Safe ignore
      }
    }
  }
}

// Global Singleton Export
export const cacheService = new CacheService();
