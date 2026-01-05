# Stage 1: Building the code
FROM node:23-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Run the app with minimal image
FROM node:23-alpine AS runner

WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Create a non-root user to run the app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder stage
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy the standalone output directory
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# Set the command to run the app
CMD ["node", "server.js", "-H", "0.0.0.0"]
