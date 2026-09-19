FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/tsconfig.json ./
COPY backend/src ./src
COPY backend/scripts ./scripts
RUN npm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm install --omit=dev \
    && npm cache clean --force

COPY --from=build /app/dist ./dist

RUN mkdir -p /app/storage \
    && chown -R node:node /app

USER node
EXPOSE 3000

CMD ["sh", "-c", "node dist/database/commands/prepare-deployment.js && node dist/database/commands/seed.js && exec node dist/server.js"]
