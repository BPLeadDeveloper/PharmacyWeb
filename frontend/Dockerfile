# Stage 1: Build Next.js app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build          # Produces .next folder

# Stage 2: Run production server
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=prod
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
EXPOSE 3000
CMD ["npx", "next", "start"]
