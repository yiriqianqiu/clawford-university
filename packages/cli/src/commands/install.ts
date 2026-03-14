import { spawnSync } from "child_process";

const VALID_PACKAGE_NAME = /^@?[a-z0-9][-a-z0-9._]*(?:\/[a-z0-9][-a-z0-9._]*)?$/;

export async function install(args: string[]): Promise<void> {
  if (args.length === 0) {
    console.error("Usage: clawford install <package-name> [package-name...]");
    process.exit(1);
  }

  for (const pkg of args) {
    const name = pkg.startsWith("@clawford/") ? pkg : `@clawford/${pkg}`;

    if (!VALID_PACKAGE_NAME.test(name)) {
      console.error(`Invalid package name: ${name}`);
      continue;
    }

    console.log(`Installing ${name}...`);
    const result = spawnSync("npm", ["install", name], { stdio: "inherit" });
    if (result.status === 0) {
      console.log(`Installed ${name}`);
    } else {
      console.error(`Failed to install ${name}`);
    }
  }
}
