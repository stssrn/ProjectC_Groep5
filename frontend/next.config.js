/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
  images: {
    domains: ["e5mraluae7u6fzg4.public.blob.vercel-storage.com"],
  },
  // webpack: (config) => {
  //   config.externals = [...config.externals, "bcrypt"];
  //   return config;
  // },
};

module.exports = nextConfig;
