---
domain: token-launcher
topic: token-standards-and-launch-mechanics
priority: high
ttl: 90d
---

# Token Launch — Domain Knowledge

## Token Standards

### ERC-20 (Ethereum)
- The standard fungible token interface on Ethereum and all EVM-compatible chains
- Required functions: `totalSupply()`, `balanceOf(address)`, `transfer(to, amount)`, `approve(spender, amount)`, `transferFrom(from, to, amount)`, `allowance(owner, spender)`
- Required events: `Transfer(from, to, value)`, `Approval(owner, spender, value)`
- Extensions commonly used:
  - **ERC-20Burnable**: `burn(amount)` and `burnFrom(account, amount)` for deflationary mechanics
  - **ERC-20Capped**: Enforces a hard cap on total supply at the contract level
  - **ERC-20Pausable**: Owner can pause all transfers — useful for emergencies but a centralization risk
  - **ERC-20Permit** (EIP-2612): Gasless approvals via signatures — improves UX
  - **ERC-20Votes**: Delegation and voting power tracking for governance tokens
  - **ERC-20Snapshot**: Historical balance snapshots for airdrops and governance

### BEP-20 (BNB Smart Chain)
- Functionally identical to ERC-20 with the same interface and events
- Additional optional metadata: `getOwner()` function returning the contract owner address
- BSC-specific considerations:
  - Lower deployment costs (~$1-5 vs. $50-500 on Ethereum)
  - PancakeSwap is the primary DEX (vs. Uniswap on Ethereum)
  - Higher scam token prevalence — users are more wary; trust signals matter more
  - BNB-denominated gas costs, which are significantly lower

### SPL Tokens (Solana)
- Fundamentally different architecture from EVM tokens
- Token accounts are separate from wallet accounts — each holder has a distinct token account
- Token Program and Token-2022 (Token Extensions) provide the standard interfaces
- Token Extensions enable: transfer fees, confidential transfers, non-transferable tokens, interest-bearing tokens, permanent delegates
- Metadata is stored separately via Metaplex Token Metadata program
- No contract source code verification in the Ethereum sense — program deployment is binary

## OpenZeppelin Contract Patterns

### Base Token Contract
- `ERC20.sol`: Standard implementation with all required functions and events
- Constructor parameters: token name, token symbol
- Initial supply minted to deployer or specified address
- Decimal precision: default 18 decimals (matching ETH), configurable for special cases

### Access Control
- **Ownable**: Single owner address with privileged functions — simplest model but single point of failure
- **Ownable2Step**: Two-step ownership transfer (propose + accept) — prevents accidental transfer to wrong address
- **AccessControl**: Role-based permissions with multiple roles (MINTER_ROLE, PAUSER_ROLE, ADMIN_ROLE) — more granular than Ownable
- **TimelockController**: Delays execution of privileged functions by a configurable period — gives community time to react to governance changes

### Upgradability
- **TransparentUpgradeableProxy**: Admin can upgrade the implementation; users interact with the proxy
- **UUPS (Universal Upgradeable Proxy Standard)**: Upgrade logic lives in the implementation contract — more gas efficient
- **Beacon Proxy**: Multiple proxies share the same implementation, upgradable in one transaction
- Upgradability considerations for tokens: adds flexibility but also trust risk — the entire token logic can be changed by the upgrade admin

### Security Extensions
- **ReentrancyGuard**: Prevents reentrancy attacks on token functions that call external contracts
- **Pausable**: Emergency stop mechanism — can pause all transfers if an exploit is detected
- **BlacklistUpgradeable**: Ability to prevent specific addresses from transacting — used by stablecoins (USDC) but controversial for utility tokens

## Tokenomics Design

### Supply Models
| Model | Mechanism | Use Case | Example |
|-------|-----------|----------|---------|
| **Fixed Supply** | Total supply minted at deployment, no minting after | Store of value, governance | UNI, AAVE |
| **Inflationary** | New tokens minted per block/epoch as rewards | Staking incentives, PoS security | ETH (post-merge, net inflationary), COMP |
| **Deflationary** | Tokens burned on transactions or via buyback-and-burn | Price support through supply reduction | BNB (quarterly burns), LUNA classic |
| **Elastic/Rebasing** | Total supply adjusts to target a price peg | Algorithmic stablecoins, index tokens | AMPL, OHM (rebasing) |
| **Dual Token** | Governance token + utility/reward token | Separate speculation from utility | AXS/SLP, GMT/GST |
| **Emission Schedule** | Decreasing mint rate over time (halving or curve) | Bitcoin-style scarcity with initial distribution | BTC, most PoW tokens |

### Distribution Allocations
Standard allocation framework — percentages vary by project type:

| Category | Typical Range | Purpose | Vesting |
|----------|--------------|---------|---------|
| **Community/Ecosystem** | 30-50% | Airdrops, rewards, grants, treasury | Released over 2-4 years |
| **Team** | 10-20% | Founding team compensation | 1 year cliff + 2-3 year linear vest |
| **Investors** | 10-25% | Seed, private, public sale | 6-12 month cliff + 1-2 year vest |
| **Treasury/DAO** | 10-20% | Future development, partnerships | Governance-controlled release |
| **Liquidity** | 5-15% | DEX pool seeding, market making | Often partially locked |
| **Advisors** | 2-5% | Strategic advisors | 6 month cliff + 1 year vest |

### Vesting Schedule Design
- **Cliff period**: No tokens released for an initial period (3-12 months) — prevents immediate selling by insiders
- **Linear vesting**: After cliff, tokens release at a constant rate per block/day/month
- **Milestone-based**: Tokens unlock when project milestones are achieved (mainnet launch, user growth targets)
- **Back-loaded vesting**: Smaller releases early, larger releases later — aligns long-term incentive
- **On-chain vs. off-chain vesting**: On-chain vesting contracts (Sablier, TokenVesting) are verifiable and trustless; off-chain agreements require trust

### Emission Schedule Principles
- **Front-loaded emission**: Higher rewards early to bootstrap adoption, decreasing over time (most yield farms)
- **Flat emission**: Constant reward rate — simple but may not sustain long-term interest
- **Curve emission**: Exponential decay (Bitcoin-style halving) — creates predictable scarcity schedule
- **Demand-responsive**: Emission adjusts based on protocol metrics (TVL, usage, revenue) — complex but economically sound
- **Key metric**: Monthly sell pressure = tokens unlocked per month * expected sell rate (typically 20-40% of unlocks are sold immediately)

## Launch Models

### Fair Launch
- No presale, no VC allocation, no team premine
- All tokens distributed through public mechanisms (mining, farming, airdrop)
- Advantages: Maximum decentralization, community trust, no insider advantage
- Disadvantages: No funding for development, bootstrap liquidity challenge, susceptible to whale sniping at launch
- Example: YFI (100% farming distribution), Bitcoin (mining only)

### Presale / ICO / IDO
- Tokens sold before public launch at a discount to expected listing price
- **Seed round**: Earliest investors, deepest discount (50-90% off), longest vesting
- **Private round**: Institutional investors, moderate discount (30-50%), medium vesting
- **Public sale / IDO**: Open to retail, smallest discount (0-20%), shortest vesting
- Launchpad platforms: PinkSale, DXSale, Fjord Foundry (LBP), DAO Maker
- Risk: Over-allocation to insiders who dump at listing; regulatory securities concerns

### Liquidity Bootstrapping Pool (LBP)
- Balancer-based mechanism for fair price discovery at launch
- Weight shifts from high (e.g., 95% project token / 5% USDC) to low (50/50) over a set period (typically 24-72 hours)
- Creates downward price pressure that discourages sniping and frontrunning
- Participants buy at a price determined by supply/demand during the auction
- Advantages: Fairer price discovery, anti-bot, capital efficient for the project
- Example: Copper Launch, Fjord Foundry

### Airdrop-First
- Distribute tokens to existing users of the protocol or ecosystem
- Retroactive airdrops reward past behavior (Uniswap, Optimism, Arbitrum pattern)
- Advantages: Instant decentralization, user loyalty reward, strong community launch
- Disadvantages: Many recipients sell immediately; sybil farming is rampant; expensive (gas for distribution)
- Anti-sybil measures: minimum activity thresholds, on-chain identity requirements, social verification

## Anti-Bot Mechanisms

### Launch Day Protection
- **Max transaction amount**: Limit the maximum tokens purchasable per transaction in the first N blocks
- **Max wallet holding**: Cap the total tokens any single wallet can hold during the launch period
- **Cooldown period**: Require a minimum time between transactions from the same address
- **Blacklist known bot addresses**: Pre-populate a blacklist with known sniper bot addresses
- **Progressive tax**: High tax rate (e.g., 90%) in the first minutes/blocks, decreasing to normal over hours
- **Whitelist launch**: Only pre-approved addresses can buy for the first N minutes

### Sniper Bot Detection
- Transactions in block 0 or 1 after liquidity addition are almost certainly bots
- Unusual gas prices (significantly above market) in early blocks indicate priority gas auctions by bots
- Multiple transactions from the same deployer-funded addresses in the first blocks
- Contract-initiated buys (as opposed to EOA-initiated) are often bot contracts

## Liquidity Management

### Initial Liquidity
- **Pool creation**: Deploy a DEX pool with project token + base token (ETH, BNB, USDC)
- **Initial ratio**: Determines the starting price — `initial_price = base_token_amount / project_token_amount`
- **Minimum viable liquidity**: $50K-$100K for serious projects; <$10K signals low confidence
- **LP token allocation**: Who holds the LP tokens controls the initial liquidity — critical trust factor

### Liquidity Locking
- **Purpose**: Prevent the team from removing liquidity (rugpull prevention)
- **Lock platforms**: Team Finance, Unicrypt, PinkLock, Mudra Lock
- **Lock duration**: Minimum 6 months for credibility; 1-2 years is standard; "forever" lock is possible but limits flexibility
- **Verification**: Users should verify locks ON-CHAIN through the lock contract, not just trust project claims
- **Partial locking**: Lock 80-90% of LP, keep 10-20% unlocked for pool management (rebalancing, migration)

### Liquidity Growth
- **Yield farming / liquidity mining**: Incentivize third-party LP with token rewards (common but creates mercenary liquidity)
- **Protocol-owned liquidity (POL)**: Project buys and permanently holds its own LP tokens (OlympusDAO model)
- **Bonds**: Users trade LP tokens or assets for discounted project tokens (protocol acquires liquidity permanently)
- **Bribes**: Pay LP incentives through vote markets (Curve/Convex model) to direct liquidity

## Security & Audit

### Common Vulnerabilities in Token Contracts
| Vulnerability | Description | Impact |
|--------------|-------------|--------|
| **Hidden mint** | Owner can mint unlimited tokens | Total supply dilution, price collapse |
| **Hidden fee/tax** | Transfer function deducts undisclosed fees | Value extraction from holders |
| **Honeypot** | Buy allowed but sell blocked or heavily taxed | Buyers cannot exit positions |
| **Proxy abuse** | Upgradeable proxy allows changing entire token logic | Any vulnerability can be introduced post-deploy |
| **Blacklist abuse** | Owner can prevent any address from selling | Selective exit prevention |
| **LP drain** | Owner can remove all DEX liquidity | Price collapses to zero |
| **Approval exploit** | Malicious approval logic drains approved tokens | Loss of funds for approvers |
| **Overflow/underflow** | Integer arithmetic errors (pre-Solidity 0.8) | Arbitrary balance manipulation |

### Audit Checklist
1. **Access control**: Are privileged functions properly restricted? Can ownership be renounced or transferred?
2. **Minting**: Is minting possible after deployment? If yes, who controls it and is it capped?
3. **Transfer logic**: Are there hidden fees, restrictions, or blacklists in the transfer function?
4. **Approval handling**: Does approve follow the ERC-20 standard? Any non-standard approval behavior?
5. **Pausability**: Can transfers be paused? By whom? Under what conditions?
6. **Upgradability**: Is the contract upgradeable? What are the upgrade permissions?
7. **Fee structure**: If fees exist, are they fixed or modifiable? What is the maximum?
8. **Supply cap**: Is total supply capped at the contract level? Can the cap be modified?
9. **External dependencies**: Does the contract depend on external oracles or contracts that could be manipulated?
10. **Compiler version**: Is it using Solidity >=0.8.0 (built-in overflow protection)?

### Rugpull Red Flags
- Unverified contract source code on the block explorer
- Owner has mint function with no cap
- No liquidity lock or lock on an unaudited lock contract
- Transfer fees that can be set to 100% by owner
- Blacklist function that can prevent any address from selling
- Team allocation >30% with no vesting contract
- No audit from a recognized firm
- Anonymous team with no track record
- Unusually high marketing spend relative to development progress
- Copied contract code with only name/symbol changed
