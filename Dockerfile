# Step 1: Use an official Node.js image to build the app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy the package.json and lock file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Step 2: Serve the built app using Node.js
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /app/dist /app

# Install serve to serve static files
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Serve the built app
CMD ["serve", "-s", ".", "-l", "3000"]
