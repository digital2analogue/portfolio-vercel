import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/resume",
        destination: "/Romney_River_Resume.pdf",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
