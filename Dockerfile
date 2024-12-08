# Stage 1: Build Stage
FROM node:18 AS build

# Set working directory
WORKDIR /apps

# Install pnpm globally
RUN npm install -g pnpm

# Copy root package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install root dependencies and bootstrap the workspace
RUN pnpm install --frozen-lockfile

# Copy the entire project
COPY . .

# Build the Next.js app
WORKDIR /apps/client
# RUN pnpm run build

# Build the NestJS app
WORKDIR /apps/server
# RUN pnpm run build

# Stage 2: Production Stage
FROM node:18-slim AS production

# Set working directory
WORKDIR /apps

# Install pnpm globally
RUN npm install -g pnpm

# Copy only necessary files from the build stage
# COPY --from=build /apps/client/.next /apps/client/.next
# COPY --from=build /apps/server/dist /apps/server/dist
COPY --from=build /apps/package.json /apps/pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --recursive

# Expose the ports
EXPOSE 3000 4000

# Start the apps
CMD ["pnpm", "start"]
