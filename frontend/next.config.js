const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.olaclick.app',
      },
    ],
  },
}

module.exports = nextConfig
