import { Client as MinioClient } from "minio";

const S3_ENDPOINT = process.env.S3_ENDPOINT ?? "http://localhost:9000";

const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY ?? "minioadmin";

const S3_SECRET_KEY = process.env.S3_SECRET_KEY ?? "minioadmin";

const S3_BUCKET = process.env.S3_BUCKET ?? "yt-comments";

async function clearBucket(): Promise<void> {
  try {
    const url = new URL(S3_ENDPOINT);

    const client = new MinioClient({
      endPoint: url.hostname,

      port: url.port ? Number(url.port) : url.protocol === "https:" ? 443 : 80,

      accessKey: S3_ACCESS_KEY,
      secretKey: S3_SECRET_KEY,

      useSSL: url.protocol === "https:",
    });

    // Check bucket exists
    const bucketExists = await client.bucketExists(S3_BUCKET);

    if (!bucketExists) {
      console.log(
        `MinIO: bucket "${S3_BUCKET}" does not exist — nothing to remove.`,
      );

      return;
    }

    // Get all objects
    const objects: string[] = [];

    const stream = client.listObjectsV2(S3_BUCKET, "", true);

    for await (const obj of stream) {
      if (obj.name) {
        objects.push(obj.name);
      }
    }

    // Delete all objects
    for (const name of objects) {
      await client.removeObject(S3_BUCKET, name);

      console.log(`Removed: ${name}`);
    }

    console.log(
      `MinIO: removed ${objects.length} object${
        objects.length === 1 ? "" : "s"
      } from "${S3_BUCKET}".`,
    );
  } catch (error) {
    console.warn(
      "MinIO: unreachable or cleanup failed.",
      error instanceof Error ? error.message : error,
    );
  }
}

async function main(): Promise<void> {
  console.log(`Cleaning MinIO bucket "${S3_BUCKET}"...`);

  await clearBucket();
}

main()
  .then(() => {
    console.log("Done.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Bucket cleanup failed:", error);

    process.exit(1);
  });
