FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/client/package.json ./packages/client/package.json
COPY packages/logger/package.json ./packages/logger/package.json
COPY packages/cli/package.json ./packages/cli/package.json
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm --filter api build
RUN pnpm --filter api deploy --prod /prod/api

FROM base AS deploy
WORKDIR /app
COPY --from=build /prod/api/node_modules ./node_modules
COPY --from=build /prod/api/dist ./dist
COPY --from=build /prod/api/package.json ./package.json

ENV NODE_ENV=production
USER node
EXPOSE 3000

CMD ["node", "dist/main.js"]
