# Lobster University — Task Tracker

## Phase 1: Foundation [DONE]
- [x] Monorepo 骨架 (pnpm workspace)
- [x] @lobster-u/sdk (manifest 校验)
- [x] @lobster-u/registry (技能搜索)
- [x] @lobster-u/cli 骨架
- [x] 示例 Skill (google-search + content-engine)
- [x] CLAUDE.md 开发标准 + 高级工作流模式
- [x] Hooks 系统
- [x] 推到 GitHub

## Phase 2: Website [DONE]
- [x] Next.js 15 项目初始化
- [x] 首页 (Hero + Quick Start + Skills Overview + Features)
- [x] Skills 展示页 (34 skills, 8 categories, 全部 ready)
- [x] Playbooks 展示页 (10 playbooks → 15 with crypto)
- [x] 文档页 (Getting Started + Skill Format + Compatibility)
- [x] 更新网站 skills 页面 (planned → ready，33 skills)
- [x] 更新网站 playbooks 页面 (5 → 10 playbooks)
- [x] Cloudflare 部署配置 (deploy.yml + static export)
- [ ] 配置 Cloudflare Secrets (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)

## Phase 3: Skills Library [DONE]

### 通用 Skills — 全部完成 (从 BotLearn fork + 改名)
- [x] 信息检索 (5): google-search, academic-search, rss-manager, twitter-intel, reddit-tracker
- [x] 内容处理 (5): summarizer, translator, rewriter, keyword-extractor, sentiment-analyzer
- [x] 代码辅助 (5): code-gen, code-review, debugger, refactor, doc-gen
- [x] 创意生成 (6): brainstorm, storyteller, writer, copywriter, social-media, content-engine
- [x] 推理 (1): mental-models (20 个思维模型)

### 自研 Skills — 全部完成 (从 BotLearn fork + 改名)
- [x] assessment — 5 维考试 + 自动打分 + 雷达图
- [x] healthcheck — 11 个收集脚本 + 5 域检查
- [x] selfoptimize — hook 系统 + 错误检测 + 学习提取
- [x] certify — 6 级认证 + 证书生成
- [x] reminder — 7 天入学引导
- [x] campus-sdk — 社交网络 API 客户端

### Crypto Skills — 全部完成 (我们的差异化，BotLearn 没有)
- [x] chain-analyzer — 链上数据分析，地址画像，资金流向
- [x] dex-trader — DEX 交易策略，流动性分析，滑点优化
- [x] token-launcher — 代币发行，合约部署，流动性引导
- [x] kol-manager — KOL 运营管理，影响力分析，合作策略
- [x] wallet-monitor — 钱包监控，大户追踪，异常告警

### 基础设施 — 已完成
- [x] validate-all.mjs — 33/33 skills 通过
- [x] skills-registry.json — 33 skills 填充
- [x] SDK 升级：加权搜索 + 拓扑排序 + 依赖树 + 丰富类型
- [x] Registry 升级：加权相关性评分
- [ ] npm 发布所有 skill 包

## Phase 4: Playbooks [DONE]
- [x] 10 双语通用 playbooks (从 BotLearn awesome repo fork)
- [x] 5 双语 Crypto playbooks (我们的差异化)
  - [x] crypto-trading-fundamentals
  - [x] whale-tracking
  - [x] token-launch-guide
  - [x] crypto-kol-operations
  - [x] defi-risk-management

## Phase 5: Smart Contracts [DONE]
- [x] KarmaToken.sol (BEP-20) — mint/burn, 自由流通
- [x] CertificateNFT.sol (ERC-721) — Soulbound, 链上元数据
- [x] SkillMarketplace.sol — 上架/购买/评分, 5% 平台费
- [x] 87 个 Hardhat 测试通过
- [x] BSC Testnet 部署脚本
- [x] BSC Mainnet 部署脚本 (CONFIRM_MAINNET 安全门)
- [ ] 部署到 BSC Testnet (需要私钥 + BNB)
- [ ] 部署到 BSC Mainnet

## Phase 6: Campus (Agent Social Network) [DONE]
- [x] @lobster-u/campus 包 (Hono + Zod)
- [x] Agent 注册/身份 CRUD
- [x] 发帖/评论/投票 (含防自投、防重复投票)
- [x] Karma 计算引擎 (post+5, comment+2, upvote+3, downvote-1, knowledge+10, verify+5, cert+20)
- [x] Knowledge Chain (分享/验证/图谱)
- [x] 58 个 Vitest 测试通过

## 基础设施 [DONE]
- [x] 文档体系 (design.md, requirements.md, user-guide.md, user-stories.md)
- [x] CONTRIBUTING.md
- [x] .npmrc 多注册表配置
- [x] 发布工具链 (validate-all, cross-regression, publish, generate-registry, generate-readmes, enrich-manifests, create-skill)
- [x] CI/CD — ci.yml (PR/push), deploy.yml (Cloudflare), publish.yml (npm tags)

## 待完成 (需要外部配置)
- [ ] 配置 GitHub Secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, NPM_TOKEN
- [ ] 部署合约到 BSC Testnet (需要私钥 + 测试 BNB)
- [ ] npm 发布所有 skill 包 (需要 NPM_TOKEN)

## 统计
- 33 skills, 15 playbooks, 3 smart contracts, 1 campus API
- 192 tests passing (SDK 33 + Campus 58 + Contracts 87 + Registry 8 + CLI 6)
- 全部已 commit 并 push
