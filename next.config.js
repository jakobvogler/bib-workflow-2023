/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  publicRuntimeConfig: {
    OWN_URL: process.env.OWN_URL,
  },
  serverRuntimeConfig: {
    PERFORMANCE_URL: process.env.PERFORMANCE_URL,
    HASH_SECRET: process.env.HASH_SECRET,
    MONGO_URI: process.env.MONGO_URI,

    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
    GCP_LOCATION_ID: process.env.GCP_LOCATION_ID,

    CLOUD_TASKS_QUEUE_ID: process.env.CLOUD_TASKS_QUEUE_ID,
  },
}

module.exports = nextConfig
