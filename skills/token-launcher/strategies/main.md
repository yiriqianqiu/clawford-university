---
strategy: token-launcher
version: 1.0.0
steps: 6
---

# Token Launch Strategy

## Step 1: Design Tokenomics
- Parse the user's request to identify: **project type**, **target chain**, **launch objectives**, **funding needs**, and **community size**
- Classify the project context:
  - **DeFi protocol**: Token should have governance and/or fee-sharing utility
  - **GameFi / app**: Token should have in-app utility (payments, access, rewards)
  - **Community / meme**: Token should optimize for fair distribution and viral mechanics
  - **Infrastructure**: Token should incentivize network participation and security
- DESIGN the supply model:
  - Select supply type: fixed, inflationary, deflationary, or dual-token from knowledge/domain.md
  - Set total supply and initial circulating supply (typically 5-15% of total at TGE)
  - Define emission schedule if inflationary
  - Design token sinks to balance any emission
- DESIGN the distribution:
  - Allocate across categories: community, team, investors, treasury, liquidity, advisors
  - Ensure community allocation is the largest single category
  - Cap team + investor allocation at 30% total
  - Define vesting schedule for each category following best practices from knowledge/best-practices.md
- MODEL sell pressure:
  - Calculate monthly token unlocks for the first 24 months
  - Estimate sell rate per category (20-40% for investors, 10-20% for team)
  - Compare against projected buy demand
  - Flag any month where sell pressure exceeds 2x projected demand
- OUTPUT: Complete tokenomics model with supply schedule, distribution table, vesting schedules, and sell pressure model

## Step 2: Write and Audit Contract
- SELECT the contract architecture:
  - Standard ERC-20/BEP-20 using OpenZeppelin base contracts
  - Extensions needed: Burnable, Capped, Permit, Votes, Pausable (only if justified)
  - Upgradability: recommend against for token contracts unless strong justification exists
  - Access control: Ownable2Step for simple tokens, AccessControl + TimelockController for complex tokens
- REVIEW security checklist from knowledge/domain.md:
  - No hidden mint without cap
  - No unlimited fee modification
  - No unrestrained blacklist
  - No approval exploits
  - Correct event emissions for all state changes
  - Solidity >=0.8.0 for overflow protection
- APPLY the audit checklist (10-point check from knowledge/domain.md):
  - Access control, minting, transfer logic, approval handling, pausability
  - Upgradability, fee structure, supply cap, external dependencies, compiler version
- FLAG any rugpull red flags from knowledge/domain.md
- OUTPUT: Contract specification with architecture decision, security analysis, and audit findings

## Step 3: Plan Deployment
- SELECT the deployment chain based on project requirements:
  - Ethereum: Highest security and prestige, highest gas costs, largest DeFi ecosystem
  - BSC: Low gas, large user base, PancakeSwap as primary DEX
  - Solana: Low fees, high throughput, Jupiter/Raydium ecosystem
  - L2s (Arbitrum, Base, Optimism): Ethereum security with lower fees, growing ecosystems
- PLAN the deployment sequence:
  1. Deploy to testnet and run all test scenarios
  2. Deploy token contract to mainnet
  3. Verify source code on block explorer
  4. Deploy vesting contracts for team and investors
  5. Transfer allocated tokens to vesting contracts
  6. Prepare liquidity tokens for pool creation
- ESTIMATE costs:
  - Contract deployment gas
  - Pool creation gas
  - LP lock transaction gas
  - Vesting contract deployment gas
  - Total deployment budget in native chain token
- OUTPUT: Deployment plan with chain selection, step-by-step sequence, and cost estimates

## Step 4: Bootstrap Liquidity
- SELECT the launch model from knowledge/domain.md:
  - Fair launch: Immediate public trading, no presale
  - Presale + DEX listing: Raise capital, then list with raised funds as liquidity
  - LBP: Dutch-auction-style price discovery via Balancer/Copper
  - Airdrop-first: Distribute to existing users, then DEX listing
- DESIGN initial liquidity:
  - Calculate initial pool size: minimum 5-10% of initial market cap
  - Determine token:base_token ratio for desired starting price
  - Plan LP token management: percentage to lock, lock duration, lock platform
- IMPLEMENT anti-bot measures (from knowledge/domain.md):
  - Max transaction limit for first 50-100 blocks
  - Max wallet limit for first 24 hours
  - Progressive tax reduction (if using tax mechanism)
  - Whitelist consideration for first minutes
- PLAN liquidity growth:
  - Liquidity mining incentives (if applicable)
  - Protocol-owned liquidity strategy
  - Target TVL milestones for first 30/60/90 days
- OUTPUT: Liquidity bootstrapping plan with pool parameters, lock details, anti-bot configuration, and growth strategy

## Step 5: Execute Launch
- COMPILE the launch execution checklist from knowledge/best-practices.md:
  - Pre-launch: contract verified, audit published, liquidity prepared, anti-bot active, vesting deployed
  - Launch day: pool created, LP locked, proof published, monitoring active
  - Post-launch: first 24h monitoring, first week holder tracking, first month analysis
- DEFINE the 90-day post-launch roadmap:
  - Week 1: Monitor, engage community, address issues
  - Month 1: First product milestone, exchange listing applications, partnership announcements
  - Month 2: Governance activation, second product milestone, ecosystem growth
  - Month 3: First vesting unlock preparation, treasury diversification, sustainability assessment
- PREPARE marketing and community plan:
  - Pre-launch: Build anticipation, share audit report, publish tokenomics documentation
  - Launch day: Coordinate announcements across channels, live monitoring dashboard
  - Post-launch: Regular updates, AMA sessions, progress reports
- OUTPUT: Complete launch execution plan with day-by-day launch sequence and 90-day roadmap

## Step 6: Risk Assessment and Report
- EVALUATE risks across all dimensions:
  - **Smart contract risk**: Audit findings, owner privileges, known vulnerability patterns
  - **Tokenomics risk**: Sell pressure concentration, reflexive mechanics, unsustainable emission
  - **Market risk**: Launch timing, competitive landscape, market sentiment
  - **Regulatory risk**: Securities classification potential, jurisdiction-specific requirements
  - **Operational risk**: Team key-person dependency, multisig configuration, emergency procedures
- GENERATE the final launch report:
  - **Tokenomics Summary**: Supply model, distribution, vesting, emission schedule
  - **Contract Security**: Architecture, audit status, owner privileges, renunciation plan
  - **Liquidity Plan**: Initial pool, lock details, growth strategy
  - **Launch Mechanics**: Anti-bot measures, launch model, execution sequence
  - **Risk Matrix**: All identified risks with likelihood, impact, and mitigation
  - **Post-Launch Plan**: 90-day roadmap with milestones and KPIs
- SELF-CHECK:
  - Does team allocation have proper vesting with on-chain enforcement?
  - Is liquidity locked with verifiable proof?
  - Are anti-bot measures in place for launch day?
  - Is sell pressure modeled for the first 24 months?
  - Are all owner privileges documented with renunciation timeline?
  - Are anti-patterns from knowledge/anti-patterns.md avoided (no insider-heavy allocation, no hidden backdoors, no unaudited launch)?
  - IF any check fails THEN revise the relevant section before delivery
