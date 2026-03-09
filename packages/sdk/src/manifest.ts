import type { SkillManifest, ValidationResult } from "./types";

const REQUIRED_FIELDS: (keyof SkillManifest)[] = [
  "name",
  "version",
  "description",
  "category",
  "tags",
  "capabilities",
  "triggers",
  "dependencies",
  "compatibility",
];

const VALID_CATEGORIES = [
  "information-retrieval",
  "content-processing",
  "code-assistance",
  "creative-generation",
  "reasoning",
  "crypto",
  "social",
  "meta",
];

const VERSION_REGEX = /^\d+\.\d+\.\d+$/;

export function validateManifest(
  manifest: Partial<SkillManifest>,
  knownSkillNames: string[] = []
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const field of REQUIRED_FIELDS) {
    if (manifest[field] === undefined || manifest[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (manifest.name && !manifest.name.startsWith("@lobster-u/")) {
    errors.push(`Package name must start with @lobster-u/, got: ${manifest.name}`);
  }

  if (manifest.version && !VERSION_REGEX.test(manifest.version)) {
    errors.push(`Invalid version format: ${manifest.version}, expected x.y.z`);
  }

  if (manifest.category && !VALID_CATEGORIES.includes(manifest.category)) {
    errors.push(`Invalid category: ${manifest.category}`);
  }

  if (manifest.tags && manifest.tags.length === 0) {
    warnings.push("No tags provided — skill will be harder to discover");
  }

  if (manifest.dependencies) {
    for (const dep of Object.keys(manifest.dependencies)) {
      if (knownSkillNames.length > 0 && !knownSkillNames.includes(dep)) {
        warnings.push(`Unknown dependency: ${dep}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
