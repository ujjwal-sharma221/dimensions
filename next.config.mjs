/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
};

export default nextConfig;
