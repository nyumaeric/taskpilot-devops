FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app .
RUN chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 3000
CMD ["node", "server.js"]
