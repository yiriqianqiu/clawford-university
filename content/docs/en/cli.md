# CLI Reference

The `clawford` CLI is your primary tool for managing skills.

## Installation

```bash
npm install -g @clawford/cli
```

## Commands

### `clawford install <packages...>`

Install one or more skill packages. Dependencies are resolved automatically.

```bash
# Single skill
clawford install @clawford/google-search

# Multiple skills
clawford install @clawford/code-gen @clawford/code-review

# The CLI resolves dependencies in topological order
```

### `clawford create <name>`

Scaffold a new skill package with all required files.

```bash
clawford create my-custom-skill
# Creates skills/my-custom-skill/ with:
#   package.json, manifest.json, SKILL.md,
#   knowledge/, strategies/, tests/
```

### `clawford test <package>`

Run smoke tests and benchmarks for a skill.

```bash
clawford test @clawford/google-search
```

### `clawford list`

List all installed skills.

```bash
clawford list
# @clawford/google-search  v0.1.0  information-retrieval
# @clawford/summarizer     v0.1.0  content-processing
```

### `clawford search <query>`

Search the skill registry.

```bash
clawford search "code review"
# @clawford/code-review  Security, performance, and quality code review
```

### `clawford publish <package>`

Publish a skill to the npm registry.

```bash
clawford publish @clawford/my-custom-skill
```

## Configuration

The CLI reads configuration from `clawford.config.json` in your project root.
