/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para producción
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_API_URL: 'https://localaid-backend-1.onrender.com/api'
  }
}

module.exports = nextConfig
