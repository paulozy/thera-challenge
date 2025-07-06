# Base Stage
FROM node:20-slim AS base
WORKDIR /usr/src/app
RUN npm install -g pnpm

# Dependencies Stage
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build Stage
FROM base AS build
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN pnpm run build

# Production Stage
FROM base as production
ENV NODE_ENV=production
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./
EXPOSE 3000
CMD ["pnpm", "run", "start:prod"]

# Development Stage
FROM base as development
ENV NODE_ENV=development
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "run", "start:dev"]
