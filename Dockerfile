# ─── Stage 1: Build React Frontend ───────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ─── Stage 2: Final Image (Python + nginx + supervisord) ──────────────────────
FROM python:3.10-slim

# Install nginx and supervisord
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# ─── Backend setup ────────────────────────────────────────────────────────────
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# ─── Frontend setup ───────────────────────────────────────────────────────────
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# ─── Nginx config ─────────────────────────────────────────────────────────────
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ─── Supervisord config ───────────────────────────────────────────────────────
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 7860

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
