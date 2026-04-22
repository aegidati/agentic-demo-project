# Backend Dockerfile for Node.js application
# Build context is app/ (root), backend source is at backend/app/
# Multi-stage build: compile TypeScript, then run minimal production image

FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files
COPY backend/app/package*.json ./

# Install full dependency graph for build stage
RUN npm ci

# Copy only files required for TypeScript build
COPY backend/app/src ./src
COPY backend/app/tsconfig.json ./tsconfig.json

# Build application
RUN npm run build


FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY backend/app/package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force
# Copy compiled code from builder
COPY --from=builder /build/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "dist/src/main.js"]
