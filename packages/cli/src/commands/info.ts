import { existsSync, readFileSync } from "fs";
import { join } from "path";

export async function info(args: string[]): Promise<void> {
  let name = args[0];
  if (!name) {
    console.error("Usage: clawford info <skill-name>");
    process.exit(1);
  }

  name = name.replace("@clawford/", "");
  const skillDir = join(process.cwd(), "skills", name);

  if (!existsSync(skillDir)) {
    console.error(`Skill not found: ${name}`);
    process.exit(1);
  }

  const manifestPath = join(skillDir, "manifest.json");
  if (!existsSync(manifestPath)) {
    console.error(`No manifest.json found for ${name}`);
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

  console.log(`\n  ${manifest.name} v${manifest.version}\n`);
  console.log(`  ${manifest.description}\n`);
  console.log(`  Category:     ${manifest.category}`);
  console.log(`  Tags:         ${manifest.tags.join(", ")}`);
  console.log(`  Capabilities: ${manifest.capabilities.join(", ")}`);
  console.log(`  Triggers:     ${manifest.triggers.join(", ")}`);

  const deps = Object.keys(manifest.dependencies || {});
  if (deps.length > 0) {
    console.log(`  Dependencies: ${deps.join(", ")}`);
  }

  const compat = manifest.compatibility || {};
  const compatStr = Object.entries(compat)
    .map(([k, v]) => `${k} ${v}`)
    .join(", ");
  if (compatStr) {
    console.log(`  Compatibility: ${compatStr}`);
  }
  console.log();
}
