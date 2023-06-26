# --- Build stage for the Next.js app ---

# Use an official Node.js runtime as a parent image
FROM node:16-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN yarn install --pure-lockfile --non-interactive

# Build the Next.js app
RUN yarn build

# --- Final stage with Node.js ---

# Use an official Node.js runtime
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package*.json and .next from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV production

# Install production dependencies
RUN yarn install --pure-lockfile --non-interactive --production

# Expose the application's default port
EXPOSE 8080

# Start the Next.js app
ENTRYPOINT yarn start
