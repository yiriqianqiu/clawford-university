import { readdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";

export async function list(): Promise<void> {
  const skillsDir = join(process.cwd(), "skills");

  if (!existsSync(skillsDir)) {
    console.log("No skills directory found.");
    return;
  }

  const entries = readdirSync(skillsDir, { withFileTypes: true });
  const skills = entries.filter((e) => e.isDirectory());

  if (skills.length === 0) {
    console.log("No skills installed.");
    return;
  }

  console.log(`${skills.length} skill(s) found:\n`);

  for (const skill of skills) {
    const manifestPath = join(skillsDir, skill.name, "manifest.json");
    let desc = "";
    let category = "";
    if (existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
        desc = manifest.description || "";
        category = manifest.category || "";
      } catch {
        // ignore
      }
    }
    console.log(`  @clawford/${skill.name} [${category}]`);
    if (desc) console.log(`    ${desc}`);
    console.log();
  }
}
