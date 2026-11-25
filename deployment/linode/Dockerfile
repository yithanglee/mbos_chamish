FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && corepack prepare pnpm@11.6.0 --activate && pnpm install --frozen-lockfile
COPY . .
ENV NITRO_PRESET=node-server NODE_ENV=production
RUN node scripts/build-templates.js && npx nitro build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/deployment/linode/schema.sql ./deployment/linode/
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production PORT=5101 UPLOADS_DIR=/app/data/uploads NITRO_PRESET=node-server
EXPOSE 5101
CMD ["node", ".output/server/index.mjs"]
