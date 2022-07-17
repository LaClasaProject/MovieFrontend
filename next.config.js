/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  env: {
    API_HOST: 'http://192.168.18.25:8080',
    adsense: {
      enabled: false,
      client: '',
      ads: {
        slot: ''
      }
    }
  },

  images: {
    domains: [
      'example.com'
    ]
  },
  
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
