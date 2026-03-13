import { describe, it, expect } from "vitest";
import { searchSkills, getSkillsByCategory, getVerifiedSkills } from "../src/index";
import type { Registry, RegistryEntry } from "../src/index";

const MOCK_SKILL: RegistryEntry = {
  name: "@clawford/google-search",
  version: "0.1.0",
  description: "Search query optimization and result ranking",
  category: "information-retrieval",
  tags: ["search", "google", "query"],
  capabilities: ["optimize-queries"],
  triggers: ["search"],
  dependencies: {},
  compatibility: { openclaw: ">=0.5.0" },
  npm: "https://www.npmjs.com/package/@clawford/google-search",
  downloads: 100,
  rating: 4.5,
  verified: true,
};

const MOCK_SKILL_2: RegistryEntry = {
  ...MOCK_SKILL,
  name: "@clawford/code-review",
  description: "Security and quality code review",
  category: "code-assistance",
  tags: ["code", "review", "security"],
  verified: false,
};

const MOCK_REGISTRY: Registry = {
  version: "0.1.0",
  generatedAt: "2026-03-09T00:00:00.000Z",
  skills: [MOCK_SKILL, MOCK_SKILL_2],
};

describe("searchSkills", () => {
  it("should find skills by name", () => {
    const results = searchSkills(MOCK_REGISTRY, "google");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("@clawford/google-search");
  });

  it("should find skills by description", () => {
    const results = searchSkills(MOCK_REGISTRY, "security");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("@clawford/code-review");
  });

  it("should find skills by tag", () => {
    const results = searchSkills(MOCK_REGISTRY, "query");
    expect(results).toHaveLength(1);
  });

  it("should be case insensitive", () => {
    const results = searchSkills(MOCK_REGISTRY, "GOOGLE");
    expect(results).toHaveLength(1);
  });

  it("should return empty for no match", () => {
    const results = searchSkills(MOCK_REGISTRY, "nonexistent");
    expect(results).toHaveLength(0);
  });
});

describe("getSkillsByCategory", () => {
  it("should filter by category", () => {
    const results = getSkillsByCategory(MOCK_REGISTRY, "information-retrieval");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("@clawford/google-search");
  });

  it("should return empty for unknown category", () => {
    const results = getSkillsByCategory(MOCK_REGISTRY, "unknown");
    expect(results).toHaveLength(0);
  });
});

describe("getVerifiedSkills", () => {
  it("should return only verified skills", () => {
    const results = getVerifiedSkills(MOCK_REGISTRY);
    expect(results).toHaveLength(1);
    expect(results[0].verified).toBe(true);
  });
});
