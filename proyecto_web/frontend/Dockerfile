# Dockerfile para Next.js frontend (producción)
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependencias
COPY package.json package-lock.json* ./
RUN npm install

# Copia el resto del código
COPY . .

# Construye la app Next.js
RUN npm run build

# --- Imagen final ---
FROM node:20-alpine AS runner
WORKDIR /app

# Copia solo lo necesario desde el builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/next.config.ts ./next.config.ts

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "run", "start"]
