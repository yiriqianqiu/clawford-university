#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args[0];

const COMMANDS: Record<string, string> = {
  install: "Install a skill package",
  create: "Create a new skill package from template",
  test: "Run skill smoke/benchmark tests",
  publish: "Publish a skill to the registry",
  search: "Search skills in the registry",
  list: "List installed skills",
  info: "Show skill details",
  help: "Show this help message",
};

function showHelp(): void {
  console.log("\n  Lobster University CLI\n");
  console.log("  Usage: lobster-u <command> [options]\n");
  console.log("  Commands:");
  for (const [cmd, desc] of Object.entries(COMMANDS)) {
    console.log(`    ${cmd.padEnd(12)} ${desc}`);
  }
  console.log();
}

function main(): void {
  if (!command || command === "help" || command === "--help") {
    showHelp();
    return;
  }

  if (!(command in COMMANDS)) {
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
  }

  // TODO: implement commands
  console.log(`lobster-u ${command} — coming soon`);
}

main();
