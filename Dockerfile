# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files trước — cache trick giống backend
COPY package*.json ./
RUN npm ci --frozen-lockfile
# npm ci: nhanh hơn npm install, đảm bảo đúng version trong package-lock.json

# Copy source và build
COPY . .

# Build args — truyền vào lúc docker build
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Stage 2: Serve với Nginx ──────────────────────────────────────────────────
FROM nginx:alpine

# Xóa config mặc định
RUN rm /etc/nginx/conf.d/default.conf

# Copy config Nginx tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files từ stage build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]