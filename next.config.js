/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  env: {
    API_HOST: 'http://localhost:8080/api',

    SITE_TITLE: 'Title',
    SITE_DESCRIPTION: 'Watch new movies or series for free at a limited time! With new additions every single day. Enjoy every video at 1080p quality.',

    WARNING_MSG: 'This is warning message to display on /watch. To disable this, simply remove "WARNING_MSG" from the "next.config.js" file.',
    DISCORD_INV: 'https://discord.gg'
  },

  images: {
    domains: [
      'example.com'
    ]
  }
}

module.exports = nextConfig