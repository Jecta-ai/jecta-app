const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors during build
  },
  reactStrictMode: true,
  env: {
    CUSTOM_VAR: process.env.CUSTOM_VAR, // This will be accessible in your code as process.env.CUSTOM_VAR
  },
};

export default nextConfig;
