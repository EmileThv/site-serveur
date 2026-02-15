// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
        {
        protocol: 'https',
        hostname: 'www.lemagducine.fr',
      },
    ],
  },
};

export default nextConfig;