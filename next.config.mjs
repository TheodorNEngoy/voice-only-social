import { createSecureHeaders } from "./security-headers.mjs";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    instrumentationHook: true
  },
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: createSecureHeaders()
      }
    ];
  }
};

export default nextConfig;
