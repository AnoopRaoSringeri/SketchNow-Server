# Stage 1: Dependencies
FROM node:20-slim AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Stage 2: Build
FROM node:20-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn buildlocal

# Stage 3: Production
FROM node:20-slim AS prod
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=build /app/build ./dist

EXPOSE 3000
CMD ["yarn", "start"]
