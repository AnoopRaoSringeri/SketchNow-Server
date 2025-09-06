# # Stage 1: Dependencies
# FROM node:20-slim AS deps
# WORKDIR /app

# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# # Stage 2: Build
# FROM node:20-slim AS build
# WORKDIR /app

# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# RUN yarn buildlocal

# # Stage 3: Production
# FROM node:20-slim AS prod
# WORKDIR /app

# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile --production

# COPY --from=build /app/build ./dist

# EXPOSE 3000
# CMD ["yarn", "start"]
# Stage 1: Dependencies (install all deps including dev)
FROM node:20-slim AS deps
WORKDIR /app

# Install only what’s needed for native builds
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Stage 2: Build (compile TypeScript etc.)
FROM node:20-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn buildlocal

# Stage 3: Production (minimal runtime)
FROM gcr.io/distroless/nodejs20-debian12 AS prod
WORKDIR /app

# Copy only production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy compiled code only
COPY --from=build /app/build ./dist

# Optional: copy runtime assets (configs, migrations, etc.)
# COPY --from=build /app/config ./config

EXPOSE 5000
CMD ["yarn", "start"]
