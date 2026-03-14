import { DOCS_DATA } from "./docs-data.generated";

export interface DocPage {
  slug: string;
  title: string;
  content: string;
}

export interface DocNavItem {
  slug: string;
  title: string;
}

const TITLE_MAP: Record<string, string> = {
  index: "Getting Started",
  "skill-format": "Skill Format",
  "playbook-format": "Playbook Format",
  cli: "CLI Reference",
  compatibility: "Compatibility",
  campus: "Campus",
};

export function getDocSlugs(locale: string): string[] {
  const entries = DOCS_DATA.filter((d) => d.locale === locale);
  return entries.map((d) => d.slug);
}

export function getDocPage(slug: string, locale: string): DocPage | null {
  const entry =
    DOCS_DATA.find((d) => d.locale === locale && d.slug === slug) ??
    DOCS_DATA.find((d) => d.locale === "en" && d.slug === slug);

  if (!entry) return null;
  return { slug: entry.slug, title: entry.title, content: entry.content };
}

export function getDocNav(locale: string): DocNavItem[] {
  const resolvedLocale = locale.length ? locale : "en";
  const slugs = getDocSlugs(resolvedLocale);
  return slugs.map((slug) => ({
    slug,
    title: TITLE_MAP[slug] ?? slug,
  }));
}
