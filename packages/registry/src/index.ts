import type { SkillManifest } from "@lobster-u/sdk";

export interface RegistryEntry extends SkillManifest {
  npm: string;
  downloads: number;
  rating: number;
  verified: boolean;
}

export interface Registry {
  version: string;
  generatedAt: string;
  skills: RegistryEntry[];
}

export function searchSkills(
  registry: Registry,
  query: string
): RegistryEntry[] {
  const lower = query.toLowerCase();
  return registry.skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(lower) ||
      skill.description.toLowerCase().includes(lower) ||
      skill.tags.some((tag) => tag.toLowerCase().includes(lower))
  );
}

export function getSkillsByCategory(
  registry: Registry,
  category: string
): RegistryEntry[] {
  return registry.skills.filter((skill) => skill.category === category);
}

export function getVerifiedSkills(registry: Registry): RegistryEntry[] {
  return registry.skills.filter((skill) => skill.verified);
}
