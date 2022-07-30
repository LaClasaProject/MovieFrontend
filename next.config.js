/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  env: {
    API_HOST: 'http://localhost:8080/api',

    SITE_TITLE: 'Title',
    SITE_DESCRIPTION: 'Watch new movies or series for free at a limited time! With new additions every single day. Enjoy every video at 1080p quality.'
  },

  images: {
    domains: [
      'example.com'
    ]
  }
}

module.exports = nextConfig