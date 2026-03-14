import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  bundlePagesRouterDependencies: true,
  serverExternalPackages: [],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-54abc7dd204845bb8da6cc0318821757.r2.dev",
        pathname: "/clawford/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
