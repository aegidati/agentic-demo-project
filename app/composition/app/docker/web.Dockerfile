# Multi-stage build: Build React/Vite app and serve with Nginx
# Build context is app/ (root), web source is at web/app/

FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files
COPY web/app/package*.json ./

# Install full dependency graph for build stage
RUN npm ci && npm cache clean --force

# Copy only files required for Vite build
COPY web/app/src ./src
COPY web/app/index.html ./index.html
COPY web/app/tsconfig.json ./tsconfig.json
COPY web/app/vite.config.ts ./vite.config.ts

# Build the application
RUN npx tsc -p tsconfig.json && npx vite build


FROM nginx:alpine

# Copy nginx configuration
COPY composition/app/docker/nginx.conf /etc/nginx/nginx.conf

# Copy built artifacts from builder
COPY --from=builder /build/dist /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 101 -S nginx || true

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
