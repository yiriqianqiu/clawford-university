import { SKILLS_DATA } from "./skills-data.generated";

export interface Skill {
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  capabilities: string[];
  triggers: string[];
  dependencies: Record<string, string>;
  expectedImprovement: number;
}

export interface SkillDetail extends Skill {
  skillMd: string;
  knowledge: { filename: string; content: string }[];
  strategies: { filename: string; content: string }[];
}

export function getAllSkills(): Skill[] {
  return SKILLS_DATA;
}

export function getSkillBySlug(slug: string): Skill | undefined {
  return SKILLS_DATA.find((s) => s.slug === slug);
}

export function getCategories(): string[] {
  return [...new Set(SKILLS_DATA.map((s) => s.category))];
}

export function filterSkills(opts: {
  category?: string;
  query?: string;
}): Skill[] {
  let results: Skill[] = SKILLS_DATA;

  if (opts.category) {
    results = results.filter((s) => s.category === opts.category);
  }

  if (opts.query) {
    const q = opts.query.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return results;
}

export function getAllSkillSlugs(): string[] {
  return SKILLS_DATA.map((s) => s.slug);
}

export function getSkillDetail(slug: string): SkillDetail | undefined {
  const skill = getSkillBySlug(slug);
  if (!skill) return undefined;

  // In Workers/edge, we don't have filesystem access for SKILL.md/knowledge/strategies
  // Return the skill with empty detail fields
  return { ...skill, skillMd: "", knowledge: [], strategies: [] };
}
