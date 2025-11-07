FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the app
RUN pnpm build

# Install serve to run the built app
RUN pnpm add -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]