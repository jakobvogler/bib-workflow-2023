/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  publicRuntimeConfig: {
    OWN_URL: process.env.OWN_URL,
  },
  serverRuntimeConfig: {
    HASH_SECRET: process.env.HASH_SECRET,
    MONGO_URI: process.env.MONGO_URI,
  },
}

module.exports = nextConfig
