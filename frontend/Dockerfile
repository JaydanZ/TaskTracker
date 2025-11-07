FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install
RUN pnpm add typescript

# Copy source code
COPY . .

# Build the app
RUN pnpm run build

EXPOSE 3000

CMD ["node", "dist/app.js"]