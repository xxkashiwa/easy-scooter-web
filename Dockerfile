FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Expose port 5173
EXPOSE 5173

# Start the application in preview mode to make it accessible via browser
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]