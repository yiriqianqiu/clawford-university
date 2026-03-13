/**
 * Patches Next.js standalone output for Cloudflare Workers compatibility.
 *
 * Problem: @libsql/isomorphic-ws has a "workerd" export condition pointing to web.mjs,
 * but Next.js trace only includes node.mjs (the Node.js entry). When OpenNext's esbuild
 * bundles with "workerd" condition, it can't find web.mjs.
 *
 * Fix: Copy web.mjs/web.cjs into the standalone output AND add them to .nft.json traces
 * so copyTracedFiles includes them in the .open-next/ directory.
 */
import { cpSync, existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const standaloneDir = resolve(".next/standalone");
const pnpmDir = join(standaloneDir, "node_modules/.pnpm");

if (!existsSync(pnpmDir)) {
  console.log("No standalone pnpm dir found, skipping patch");
  process.exit(0);
}

// Step 1: Copy missing web.mjs/web.cjs into standalone output
const entries = readdirSync(pnpmDir).filter((d) =>
  d.startsWith("@libsql+isomorphic-ws")
);

let patchedPkgRelPath = null;

for (const entry of entries) {
  const tracedPkg = join(pnpmDir, entry, "node_modules/@libsql/isomorphic-ws");

  // Find source package in real node_modules (could be at project or monorepo level)
  for (const base of [resolve("node_modules/.pnpm"), resolve("../../node_modules/.pnpm")]) {
    const realPkg = join(base, entry, "node_modules/@libsql/isomorphic-ws");
    if (!existsSync(realPkg)) continue;

    for (const file of ["web.mjs", "web.cjs"]) {
      const src = join(realPkg, file);
      const dest = join(tracedPkg, file);
      if (existsSync(src) && !existsSync(dest)) {
        cpSync(src, dest);
        console.log(`Copied: ${file} → standalone`);
      }
    }

    // Remember the relative path for nft.json patching
    // The nft.json paths are relative from the .next/server/app/[locale]/... directory
    // They look like: ../../../../../../../node_modules/.pnpm/@libsql+isomorphic-ws@.../node_modules/@libsql/isomorphic-ws/node.mjs
    patchedPkgRelPath = `node_modules/.pnpm/${entry}/node_modules/@libsql/isomorphic-ws`;
    break;
  }
}

if (!patchedPkgRelPath) {
  console.log("No @libsql/isomorphic-ws package found to patch");
  process.exit(0);
}

// Step 2: Patch .nft.json trace files to include web.mjs and web.cjs
// IMPORTANT: copyTracedFiles reads .nft.json from .next/ (not .next/standalone/)
const standaloneAppDir = resolve(".next");

function patchNftFiles(dir) {
  let count = 0;
  const items = readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = join(dir, item.name);

    if (item.isDirectory()) {
      count += patchNftFiles(fullPath);
      continue;
    }

    if (!item.name.endsWith(".nft.json")) continue;

    const content = readFileSync(fullPath, "utf8");
    if (!content.includes("isomorphic-ws")) continue;

    const data = JSON.parse(content);
    const files = data.files;

    // Find an existing isomorphic-ws entry to derive the relative prefix
    const existing = files.find(
      (f) => f.includes("isomorphic-ws") && f.endsWith("node.mjs")
    );
    if (!existing) continue;

    // Derive web.mjs path from node.mjs path
    const webMjs = existing.replace("node.mjs", "web.mjs");
    const webCjs = existing.replace("node.mjs", "web.cjs");

    let modified = false;
    if (!files.includes(webMjs)) {
      files.push(webMjs);
      modified = true;
    }
    if (!files.includes(webCjs)) {
      files.push(webCjs);
      modified = true;
    }

    if (modified) {
      writeFileSync(fullPath, JSON.stringify(data));
      count++;
    }
  }

  return count;
}

const patched = patchNftFiles(standaloneAppDir);
console.log(`Patched ${patched} .nft.json trace files`);
