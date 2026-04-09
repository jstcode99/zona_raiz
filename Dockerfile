# Dockerfile - Multi-stage build for zona_raiz

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install

# Stage 2: Builder
FROM node:20-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args - defaults for Docker build
ARG NEXT_PUBLIC_SUPABASE_URL=http://localhost:5432
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID=dummy
ARG GOOGLE_CLIENT_SECRET=dummy
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=dummy
ARG NEXT_PUBLIC_HCAPTCHA_SITE_KEY=dummy

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_HCAPTCHA_SITE_KEY=$NEXT_PUBLIC_HCAPTCHA_SITE_KEY

RUN corepack enable pnpm && pnpm build

# Stage 3: Runner
FROM node:20-alpine AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/cache ./.next/cache

# Set proper permissions
RUN chown nextjs:nodejs . && \
    chown -R nextjs:nodejs /app/.next

USER nextjs

# Environment variables for production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "new (require('http').request({hostname:'localhost',port:3000,path:'/api/health',method:'GET'}).end())" || exit 1

# Start command
CMD ["node", "server.js"]