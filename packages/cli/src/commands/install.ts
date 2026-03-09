import { execSync } from "child_process";

export async function install(args: string[]): Promise<void> {
  if (args.length === 0) {
    console.error("Usage: lobster-u install <package-name> [package-name...]");
    process.exit(1);
  }

  for (const pkg of args) {
    const name = pkg.startsWith("@lobster-u/") ? pkg : `@lobster-u/${pkg}`;
    console.log(`Installing ${name}...`);
    try {
      execSync(`npm install ${name}`, { stdio: "inherit" });
      console.log(`Installed ${name}`);
    } catch {
      console.error(`Failed to install ${name}`);
    }
  }
}
