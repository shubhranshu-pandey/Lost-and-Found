# Multi-stage build for production

# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/client

# Copy frontend package files
COPY client/package*.json ./

# Install ALL dependencies (react-scripts is a devDependency needed for build)
RUN npm install

# Copy frontend source
COPY client/ ./

# Build frontend for production
RUN npm run build

# Stage 2: Setup backend with built frontend
FROM node:18-alpine

WORKDIR /app

# Install production dependencies for backend
COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend source files
COPY server-jwt.js ./
COPY middleware/ ./middleware/

# Copy built frontend from previous stage
COPY --from=frontend-build /app/client/build ./client/build

# Create directory for database
RUN mkdir -p /app/data

# Expose port 5002
EXPOSE 5002

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5002/api/items', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run the application
CMD ["node", "server-jwt.js"]
