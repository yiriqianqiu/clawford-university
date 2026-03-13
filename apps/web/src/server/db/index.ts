import { drizzle } from "drizzle-orm/libsql";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient } from "./turso-client";
import * as schema from "./schema";

// Lazy-init: in Cloudflare Workers, process.env is populated per-request
// by OpenNext's populateProcessEnv, not at module load time.
let _db: LibSQLDatabase<typeof schema> | null = null;

function createDb() {
  const url = process.env.TURSO_DATABASE_URL ?? "";
  const client = createClient({
    url: url.startsWith("file:") ? "http://localhost:8080" : url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
}

export const db = new Proxy({} as LibSQLDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    if (!_db) {
      _db = createDb();
    }
    return Reflect.get(_db, prop, receiver);
  },
});

export type Database = LibSQLDatabase<typeof schema>;
