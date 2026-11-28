import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Resume PDF removed 2026-11-28; send old /resume links to contact.
        source: "/resume",
        destination: "/contact",
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
