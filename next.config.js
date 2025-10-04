/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  env: {
    NEXT_PUBLIC_API_URL: 'https://localaid-backend-1.onrender.com/api'
  }
}

module.exports = nextConfig