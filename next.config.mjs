/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  // Images config
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
    ],
  },
  // Webpack configuration to handle @node-rs/argon2
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      // Exclude @node-rs/argon2 from being bundled by Webpack
      config.externals.push({
        "@node-rs/argon2": "@node-rs/argon2",
      });
    }

    return config;
  },
};

export default nextConfig;
