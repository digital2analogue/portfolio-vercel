import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/resume",
        destination: "/Romney_River_Resume.pdf",
        permanent: false,
      },
      {
        // Case study renamed 2026-07-02; preserve shared/indexed links.
        source: "/work/design-tokens",
        destination: "/work/system",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
