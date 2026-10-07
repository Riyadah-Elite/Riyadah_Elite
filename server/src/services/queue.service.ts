import amqplib, { Channel, ChannelModel } from "amqplib";

export interface QueueJob<T = unknown> {
  id: string;
  type: string;
  data: T;
  createdAt: string;
  attempts?: number;
}

export type QueueName = "email_queue" | "notification_queue" | "media_processing_queue";

export interface QueueConfig {
  url?: string;
  hostname?: string;
  port?: number;
  username?: string;
  password?: string;
  vhost?: string;
}

export class QueueService {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private enabled: boolean = false;
  private isConnecting: boolean = false;
  private consumersRegistered: Map<string, (job: QueueJob) => Promise<void>> = new Map();

  constructor(private config?: QueueConfig) {
    const rabbitUrl = this.config?.url ?? process.env.RABBITMQ_URL;
    const rabbitHost = this.config?.hostname ?? process.env.RABBITMQ_HOST;

    if (rabbitUrl || rabbitHost) {
      this.initConnection();
    }
  }

  private async initConnection(): Promise<void> {
    if (this.isConnecting || this.enabled) return;
    this.isConnecting = true;

    try {
      const url =
        this.config?.url ??
        process.env.RABBITMQ_URL ??
        `amqp://${this.config?.username ?? process.env.RABBITMQ_USER ?? "guest"}:${this.config?.password ?? process.env.RABBITMQ_PASSWORD ?? "guest"}@${this.config?.hostname ?? process.env.RABBITMQ_HOST ?? "localhost"}:${this.config?.port ?? process.env.RABBITMQ_PORT ?? 5672}`;

      this.connection = await amqplib.connect(url);
      this.channel = await this.connection.createChannel();
      this.enabled = true;

      // Define standard durable dead-letter exchange & queues
      await this.channel.assertExchange("riyadah.dlx", "direct", { durable: true });
      await this.channel.assertQueue("riyadah.dead_letter", { durable: true });
      await this.channel.bindQueue("riyadah.dead_letter", "riyadah.dlx", "dead_letter");

      // Assert default core queues
      const queues: QueueName[] = ["email_queue", "notification_queue", "media_processing_queue"];
      for (const q of queues) {
        await this.channel.assertQueue(q, {
          durable: true,
          deadLetterExchange: "riyadah.dlx",
          deadLetterRoutingKey: "dead_letter",
        });
      }

      this.connection.on("error", (err) => {
        console.warn(`[QUEUE:RABBITMQ] Connection error: ${err.message}`);
        this.enabled = false;
      });

      this.connection.on("close", () => {
        this.enabled = false;
      });

      // Re-register any listeners that were waiting
      for (const [queue, handler] of this.consumersRegistered.entries()) {
        await this.consume(queue as QueueName, handler);
      }
    } catch {
      // Graceful fallback for environments where RabbitMQ broker is not running
      this.enabled = false;
    } finally {
      this.isConnecting = false;
    }
  }

  public isEnabled(): boolean {
    return this.enabled && this.channel !== null;
  }

  public async publish<T>(queue: QueueName, type: string, data: T): Promise<boolean> {
    const job: QueueJob<T> = {
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      data,
      createdAt: new Date().toISOString(),
      attempts: 0,
    };

    if (!this.isEnabled()) {
      // In-memory / console fallback when broker is not connected
      console.log(`[QUEUE:MOCK_PUBLISH] Queue=${queue} Type=${type} JobId=${job.id}`);
      return true;
    }

    try {
      const buffer = Buffer.from(JSON.stringify(job));
      return this.channel!.sendToQueue(queue, buffer, { persistent: true });
    } catch (err: any) {
      console.error(`[QUEUE:PUBLISH_ERROR] Failed to send job to queue ${queue}:`, err.message);
      return false;
    }
  }

  public async consume(queue: QueueName, handler: (job: QueueJob) => Promise<void>): Promise<void> {
    this.consumersRegistered.set(queue, handler);

    if (!this.isEnabled()) {
      return;
    }

    try {
      await this.channel!.assertQueue(queue, { durable: true });
      await this.channel!.consume(queue, async (msg) => {
        if (!msg) return;
        try {
          const content = JSON.parse(msg.content.toString()) as QueueJob;
          await handler(content);
          this.channel!.ack(msg);
        } catch (processError) {
          console.error(`[QUEUE:CONSUME_ERROR] Processing failed on queue ${queue}:`, processError);
          // Reject with requeue: false so it transitions cleanly to Dead Letter Exchange
          this.channel!.nack(msg, false, false);
        }
      });
    } catch (err: any) {
      console.error(`[QUEUE:CONSUME_SETUP_ERROR] Queue ${queue}:`, err.message);
    }
  }

  public async checkHealth(): Promise<{ status: "HEALTHY" | "DISABLED" | "UNHEALTHY"; message?: string }> {
    if (!process.env.RABBITMQ_URL && !process.env.RABBITMQ_HOST) {
      return { status: "DISABLED", message: "RabbitMQ broker not configured" };
    }

    if (!this.isEnabled()) {
      return { status: "UNHEALTHY", message: "Broker disconnected" };
    }

    return { status: "HEALTHY" };
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
    } catch {
      // Safe ignore
    }
  }
}

// Global Singleton Export
export const queueService = new QueueService();
