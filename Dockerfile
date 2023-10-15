# Build stage
FROM node:18 AS builder
WORKDIR /app/frontend
COPY . .
RUN pnpm i
RUN pnpm build

# Production stage
FROM node:18-alpine
WORKDIR /app/frontend
COPY --from=builder /app/frontend .
EXPOSE 3000
CMD ["pnpm", "start"]
