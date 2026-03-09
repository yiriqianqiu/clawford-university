export interface SkillManifest {
  name: string;
  version: string;
  description: string;
  category: SkillCategory;
  tags: string[];
  capabilities: string[];
  triggers: string[];
  dependencies: Record<string, string>;
  compatibility: {
    openclaw?: string;
    claudeCode?: string;
    cursor?: string;
    windsurf?: string;
  };
}

export type SkillCategory =
  | "information-retrieval"
  | "content-processing"
  | "code-assistance"
  | "creative-generation"
  | "reasoning"
  | "crypto"
  | "social"
  | "meta";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
