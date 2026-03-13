import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  // Force webpack (Turbopack externalizes @libsql/client) then patch standalone
  // to include @libsql/isomorphic-ws/web.mjs needed by esbuild workerd condition
  buildCommand: "npx next build --webpack && node scripts/patch-standalone.mjs",
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  edgeExternals: ["node:crypto"],
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
};

export default config;
