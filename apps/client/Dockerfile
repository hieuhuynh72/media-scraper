# Stage 1: Build Stage
FROM node:20 AS build

# Set working directory
WORKDIR /apps/client

# Install pnpm globally
RUN npm install -g pnpm

# Copy client package.json and pnpm-lock.yaml from the root directory
COPY package.json ./

# Install client dependencies
RUN pnpm install

# Copy the entire client project
COPY . .

# Build the Next.js app
RUN pnpm build:client

# Stage 2: Production Stage
# FROM nginx:alpine
FROM node:20-slim AS production

# Set working directory
WORKDIR /apps/client

# Install pnpm globally
RUN npm install -g pnpm

# Copy only necessary files from the build stage
# COPY --from=build /apps/client/apps/client/.next/server/app/ /usr/share/nginx/html
# COPY --from=build  /apps/client/apps/client/.next/ /usr/share/nginx/html/_next
COPY package.json ./
COPY --from=build /apps/client/node_modules /apps/client/node_modules
COPY --from=build /apps/client/apps/client/node_modules /apps/client/apps/client/node_modules
COPY --from=build /apps/client/apps/client/.next /apps/client/apps/client/.next
COPY --from=build /apps/client/apps/client/public /apps/client/apps/client/public

# Install client dependencies
RUN pnpm install

# Copy the entire client project
COPY . .

# Expose the port
EXPOSE 3000

# Start the Next.js app
CMD ["pnpm", "start:client"]
