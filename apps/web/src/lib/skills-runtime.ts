/**
 * Runtime-safe skills module for Cloudflare Workers.
 * Uses build-time generated data instead of filesystem access.
 */
import { SKILLS_DATA } from "./skills-data.generated";
import type { Skill } from "./skills";

export type { Skill };

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
        s.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  return results;
}
