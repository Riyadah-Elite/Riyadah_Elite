/**
 * @author aliasgarbootwala3@gmial.com
 */

import app from "./app.js";
import http from "node:http";

const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 5000;

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `[Server] Port ${PORT} is already in use (EADDRINUSE). Please wait a moment or free the port.`,
    );
    process.exit(1);
  } else {
    console.error("[Server] Fatal server error:", error);
    process.exit(1);
  }
});

const shutdown = (signal: string) => {
  console.log(`[Server] Received ${signal}. Closing HTTP server on port ${PORT}...`);
  server.close(() => {
    console.log(`[Server] HTTP server on port ${PORT} closed cleanly.`);
    process.exit(0);
  });

  setTimeout(() => {
    console.error("[Server] Forcefully terminating lingering connections after timeout.");
    process.exit(1);
  }, 2000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGUSR2", () => {
  server.close(() => {
    process.kill(process.pid, "SIGUSR2");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
