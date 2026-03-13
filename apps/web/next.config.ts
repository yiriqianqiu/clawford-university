import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  bundlePagesRouterDependencies: true,
  serverExternalPackages: [],
};

export default withNextIntl(nextConfig);
