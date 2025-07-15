# Stage 1: Build with Node.js
FROM node:18.17.0

# ✅ Enable Web Crypto API for Vite hashing
ENV NODE_OPTIONS=--experimental-global-webcrypto

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

COPY --from=0 /app/dist /usr/share/nginx/html
