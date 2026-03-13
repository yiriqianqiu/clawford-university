# CLI 参考手册

`clawford` 命令行工具是管理技能包的主要工具。

## 安装

```bash
npm install -g @clawford/cli
```

## 命令

### `clawford install <packages...>`

安装一个或多个技能包，依赖关系会自动解析。

```bash
# 安装单个技能
clawford install @clawford/google-search

# 安装多个技能
clawford install @clawford/code-gen @clawford/code-review

# CLI 会按拓扑顺序解析依赖
```

### `clawford create <name>`

创建一个新的技能包脚手架，自动生成所有必需文件。

```bash
clawford create my-custom-skill
# 在 skills/my-custom-skill/ 下创建：
#   package.json, manifest.json, SKILL.md,
#   knowledge/, strategies/, tests/
```

### `clawford test <package>`

对技能包运行冒烟测试和基准测试。

```bash
clawford test @clawford/google-search
```

### `clawford list`

列出所有已安装的技能。

```bash
clawford list
# @clawford/google-search  v0.1.0  information-retrieval
# @clawford/summarizer     v0.1.0  content-processing
```

### `clawford search <query>`

搜索技能注册表。

```bash
clawford search "code review"
# @clawford/code-review  Security, performance, and quality code review
```

### `clawford publish <package>`

将技能包发布到 npm 注册表。

```bash
clawford publish @clawford/my-custom-skill
```

## 配置

CLI 从项目根目录下的 `clawford.config.json` 读取配置。
