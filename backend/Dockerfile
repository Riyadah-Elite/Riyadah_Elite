FROM node:22-bookworm-slim AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ---------------------------------------------------------------------------
# Build stage. `npm run build` also runs `prisma generate` through prebuild.
# Kept as a named target because docker-compose uses it for the one-off schema
# push service.
# ---------------------------------------------------------------------------
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

RUN npm run build

# ---------------------------------------------------------------------------
# Runtime dependencies only. This removes TypeScript, Prisma CLI and the rest
# of the build toolchain from the final layer.
# ---------------------------------------------------------------------------
FROM node:22-bookworm-slim AS production-dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev \
    && npm cache clean --force

# ---------------------------------------------------------------------------
# Final image.
# ---------------------------------------------------------------------------
FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production \
    PORT=5000

WORKDIR /app

COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./

# Multer writes uploads to ./public/temp before they are archived in MinIO.
RUN mkdir -p public/temp \
    && chown -R node:node public

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 5000) + '/api/v1/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "dist/server.js"]
