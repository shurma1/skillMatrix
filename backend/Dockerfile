# -- Build stage --
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./
# Prefer pnpm if lock exists, else npm
RUN if [ -f pnpm-lock.yaml ]; then npm i -g pnpm@10 && pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npm run lint || true
RUN npm run build
# Don't prune dev dependencies yet as we need ts-node for init scripts

# -- Runtime stage --
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Install PostgreSQL client for pg_isready
RUN apk add --no-cache postgresql-client

COPY --from=build /app/package.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/config ./config
COPY --from=build /app/docs ./docs
COPY --from=build /app/scripts ./scripts
# Copy all node_modules (including dev deps for ts-node)
COPY --from=build /app/node_modules ./node_modules

# Copy and make executable the init script
COPY scripts/init-db.sh ./
RUN chmod +x ./init-db.sh

EXPOSE 8080
CMD ["./init-db.sh"]
