import { readFileSync } from "fs";
import { join } from "path";
import { searchSkills } from "@lobster-u/registry";
import type { Registry } from "@lobster-u/registry";

export async function search(args: string[]): Promise<void> {
  const query = args.join(" ");
  if (!query) {
    console.error("Usage: lobster-u search <query>");
    process.exit(1);
  }

  let registry: Registry;
  try {
    const raw = readFileSync(
      join(process.cwd(), "skills-registry.json"),
      "utf-8"
    );
    registry = JSON.parse(raw) as Registry;
  } catch {
    console.error("Could not read skills-registry.json");
    process.exit(1);
  }

  const results = searchSkills(registry, query);

  if (results.length === 0) {
    console.log(`No skills found for "${query}"`);
    return;
  }

  console.log(`Found ${results.length} skill(s):\n`);
  for (const skill of results) {
    const verified = skill.verified ? " [verified]" : "";
    console.log(`  ${skill.name}${verified}`);
    console.log(`    ${skill.description}`);
    console.log();
  }
}
