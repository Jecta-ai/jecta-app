const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  env: {
    CUSTOM_VAR: process.env.CUSTOM_VAR,
  },
};

export default nextConfig;
