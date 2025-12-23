
FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "index.ts"]
