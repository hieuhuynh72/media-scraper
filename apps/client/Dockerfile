# Stage 1: Build Stage
FROM node:18 AS build

# Set working directory
WORKDIR /apps/client

# Install pnpm globally
RUN npm install -g pnpm

# Copy client package.json and pnpm-lock.yaml
COPY package.json ./

# Install client dependencies
RUN pnpm install 

# Copy the entire client project
COPY . .

# Build the Next.js app
RUN pnpm run build

# Stage 2: Production Stage
FROM node:18-slim AS production

# Set working directory
WORKDIR /apps/client

# Install pnpm globally
RUN npm install -g pnpm

# Copy only necessary files from the build stage
COPY --from=build /apps/client/.next /apps/client/.next
COPY --from=build /apps/client/package.json /apps/client/package.json

# Install only production dependencies
RUN pnpm install 

# Expose the port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]