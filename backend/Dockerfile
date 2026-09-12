FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build \
    && mkdir -p dist/database/migrations \
    && cp -R src/database/migrations/. dist/database/migrations/

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force

COPY --from=build /app/dist ./dist

RUN mkdir -p /app/storage \
    && chown -R node:node /app

USER node

EXPOSE 3000

CMD ["sh", "-c", "node dist/database/prepare.js && exec node dist/server.js"]
