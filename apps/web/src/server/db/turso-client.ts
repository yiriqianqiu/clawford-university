import { createClient as _createClient, type Config } from "@libsql/client/web";

/**
 * Wrapper around @libsql/client/web createClient that provides a custom fetch
 * for Cloudflare Workers compatibility. The default client fails with
 * "Cannot read properties of null (reading 'has')" in Workers.
 */
export function createClient(config: Config) {
  return _createClient({
    ...config,
    fetch: globalThis.fetch.bind(globalThis),
  });
}
