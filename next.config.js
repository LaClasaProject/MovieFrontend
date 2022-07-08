/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  env: {
    API_HOST: 'http://192.168.18.25:8080'
  }
}

module.exports = nextConfig
