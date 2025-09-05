# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy only package.json + lock file first (better layer caching)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copy deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build TypeScript -> dist/
RUN yarn build

# Stage 3: Production
FROM node:20-alpine AS prod
WORKDIR /app

# Copy only package.json + lock
COPY package.json yarn.lock ./
# Install only production deps
RUN yarn install --frozen-lockfile --production

RUN ls
# Copy compiled JS only (not TS, not tests, not configs)
COPY --from=build /app/dist ./dist

# Copy runtime assets if needed (e.g. config, public, migrations, etc.)
# COPY --from=build /app/config ./config

EXPOSE 3000
CMD ["yarn", "start"]
