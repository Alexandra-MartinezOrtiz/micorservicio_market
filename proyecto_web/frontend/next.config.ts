/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remover redirects automáticos - los manejaremos en el cliente
  trailingSlash: false,
  // Si usas App Router (opcional)
  experimental: {
    appDir: false, // Cambiar a true si usas app directory
  }
}

module.exports = nextConfig;