/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  env: {
    API_HOST: 'http://192.168.18.25:8080',

    SITE_TITLE: 'Title',
    SITE_DESCRIPTION: 'Watch new movies or series for free at a limited time! With new additions every single day. Enjoy every video at 1080p quality.'
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
