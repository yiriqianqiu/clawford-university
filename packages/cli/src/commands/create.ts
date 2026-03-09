import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const SKILL_MD_TEMPLATE = `# {{NAME}} Skill

## Role

Describe the agent's role when this skill is active.

## Triggers

- When should this skill activate?

## Capabilities

1. What can this skill do?

## Boundaries

- What should this skill NOT do?
`;

export async function create(args: string[]): Promise<void> {
  const name = args[0];
  if (!name) {
    console.error("Usage: lobster-u create <skill-name>");
    process.exit(1);
  }

  const dir = join(process.cwd(), "skills", name);

  const dirs = [
    dir,
    join(dir, "knowledge"),
    join(dir, "strategies"),
    join(dir, "tests"),
  ];

  for (const d of dirs) {
    mkdirSync(d, { recursive: true });
  }

  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify(
      {
        name: `@lobster-u/${name}`,
        version: "0.1.0",
        description: "",
        keywords: [],
        license: "MIT",
        files: ["manifest.json", "SKILL.md", "knowledge", "strategies"],
      },
      null,
      2
    )
  );

  writeFileSync(
    join(dir, "manifest.json"),
    JSON.stringify(
      {
        name: `@lobster-u/${name}`,
        version: "0.1.0",
        description: "",
        category: "meta",
        tags: [],
        capabilities: [],
        triggers: [],
        dependencies: {},
        compatibility: { openclaw: ">=0.5.0", claudeCode: ">=1.0.0" },
      },
      null,
      2
    )
  );

  writeFileSync(
    join(dir, "SKILL.md"),
    SKILL_MD_TEMPLATE.replace("{{NAME}}", name)
  );

  writeFileSync(join(dir, "knowledge", "domain.md"), `# ${name} — Domain Knowledge\n`);
  writeFileSync(join(dir, "strategies", "main.md"), `# ${name} — Strategy\n`);

  console.log(`Created skill scaffold at skills/${name}/`);
  console.log("  Edit SKILL.md, knowledge/, and strategies/ to define your skill.");
}
