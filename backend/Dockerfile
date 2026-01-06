# Stage 1: Build NestJS app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build          # Produces dist/ folder

# Stage 2: Run production app
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=prod
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
