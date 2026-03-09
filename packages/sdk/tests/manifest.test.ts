import { describe, it, expect } from "vitest";
import { validateManifest } from "../src/manifest";
import type { SkillManifest } from "../src/types";

const VALID_MANIFEST: SkillManifest = {
  name: "@lobster-u/test-skill",
  version: "0.1.0",
  description: "A test skill",
  category: "information-retrieval",
  tags: ["test"],
  capabilities: ["test-cap"],
  triggers: ["test"],
  dependencies: {},
  compatibility: { openclaw: ">=0.5.0" },
};

describe("validateManifest", () => {
  it("should pass for a valid manifest", () => {
    const result = validateManifest(VALID_MANIFEST);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should fail when required fields are missing", () => {
    const result = validateManifest({});
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((e) => e.includes("Missing required field"))).toBe(true);
  });

  it("should fail when name does not start with @lobster-u/", () => {
    const result = validateManifest({ ...VALID_MANIFEST, name: "bad-name" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("@lobster-u/"))).toBe(true);
  });

  it("should fail for invalid version format", () => {
    const result = validateManifest({ ...VALID_MANIFEST, version: "1.0" });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Invalid version"))).toBe(true);
  });

  it("should fail for invalid category", () => {
    const result = validateManifest({
      ...VALID_MANIFEST,
      category: "invalid-cat" as SkillManifest["category"],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Invalid category"))).toBe(true);
  });

  it("should warn when tags are empty", () => {
    const result = validateManifest({ ...VALID_MANIFEST, tags: [] });
    expect(result.valid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.some((w) => w.includes("No tags"))).toBe(true);
  });

  it("should warn for unknown dependencies", () => {
    const manifest = {
      ...VALID_MANIFEST,
      dependencies: { "@lobster-u/unknown": ">=0.1.0" },
    };
    const result = validateManifest(manifest, ["@lobster-u/google-search"]);
    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.includes("Unknown dependency"))).toBe(true);
  });

  it("should not warn for known dependencies", () => {
    const manifest = {
      ...VALID_MANIFEST,
      dependencies: { "@lobster-u/google-search": ">=0.1.0" },
    };
    const result = validateManifest(manifest, ["@lobster-u/google-search"]);
    expect(result.warnings).toHaveLength(0);
  });
});
