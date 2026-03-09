import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execSync } from "child_process";
import { existsSync, rmSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "../../..");
const CLI = join(__dirname, "../dist/cli.js");

describe("CLI", () => {
  it("should show help with no args", () => {
    const output = execSync(`node ${CLI}`, { cwd: ROOT, encoding: "utf-8" });
    expect(output).toContain("Lobster University CLI");
    expect(output).toContain("install");
    expect(output).toContain("create");
  });

  it("should show help with --help", () => {
    const output = execSync(`node ${CLI} --help`, { cwd: ROOT, encoding: "utf-8" });
    expect(output).toContain("Lobster University CLI");
  });

  it("should exit with error for unknown command", () => {
    try {
      execSync(`node ${CLI} unknown-cmd`, { cwd: ROOT, encoding: "utf-8", stdio: "pipe" });
      expect.fail("should have thrown");
    } catch (err: unknown) {
      const e = err as { stderr: string };
      expect(e.stderr).toContain("Unknown command");
    }
  });

  it("should list installed skills", () => {
    const output = execSync(`node ${CLI} list`, { cwd: ROOT, encoding: "utf-8" });
    expect(output).toContain("@lobster-u/google-search");
    expect(output).toContain("@lobster-u/content-engine");
  });

  it("should show skill info", () => {
    const output = execSync(`node ${CLI} info google-search`, { cwd: ROOT, encoding: "utf-8" });
    expect(output).toContain("@lobster-u/google-search");
    expect(output).toContain("information-retrieval");
    expect(output).toContain("search");
  });

  describe("create", () => {
    const testSkillDir = join(ROOT, "skills", "cli-test-skill");

    afterEach(() => {
      if (existsSync(testSkillDir)) {
        rmSync(testSkillDir, { recursive: true });
      }
    });

    it("should scaffold a new skill", () => {
      const output = execSync(`node ${CLI} create cli-test-skill`, {
        cwd: ROOT,
        encoding: "utf-8",
      });
      expect(output).toContain("Created skill scaffold");
      expect(existsSync(join(testSkillDir, "package.json"))).toBe(true);
      expect(existsSync(join(testSkillDir, "manifest.json"))).toBe(true);
      expect(existsSync(join(testSkillDir, "SKILL.md"))).toBe(true);
      expect(existsSync(join(testSkillDir, "knowledge", "domain.md"))).toBe(true);
      expect(existsSync(join(testSkillDir, "strategies", "main.md"))).toBe(true);
    });
  });
});
