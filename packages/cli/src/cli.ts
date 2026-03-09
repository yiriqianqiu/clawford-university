#!/usr/bin/env node

import { install } from "./commands/install";
import { create } from "./commands/create";
import { search } from "./commands/search";
import { list } from "./commands/list";
import { info } from "./commands/info";

const args = process.argv.slice(2);
const command = args[0];
const commandArgs = args.slice(1);

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

async function main(): Promise<void> {
  if (!command || command === "help" || command === "--help") {
    showHelp();
    return;
  }

  if (!(command in COMMANDS)) {
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
  }

  switch (command) {
    case "install":
      await install(commandArgs);
      break;
    case "create":
      await create(commandArgs);
      break;
    case "search":
      await search(commandArgs);
      break;
    case "list":
      await list();
      break;
    case "info":
      await info(commandArgs);
      break;
    default:
      console.log(`lobster-u ${command} — coming soon`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
