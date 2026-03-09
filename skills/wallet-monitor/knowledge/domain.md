---
domain: wallet-monitor
topic: on-chain-wallet-intelligence-and-monitoring
priority: high
ttl: 90d
---

# Wallet Monitoring — Domain Knowledge

## Wallet Entity Classification

On-chain addresses are pseudonymous, but behavior patterns, transaction histories, and public labels allow classification into entity types. Accurate classification is the foundation of useful monitoring — without it, every large transfer looks identical.

### Centralized Exchanges (CEX)
- **Characteristics**: High transaction volume, interact with thousands of unique addresses daily, hold large balances across many tokens, use hot/cold wallet separation
- **Notable labeled addresses**: Binance, Coinbase, OKX, Bybit, Kraken, KuCoin, Gate.io, Bitfinex each operate dozens of hot wallets and a smaller number of cold storage addresses
- **Monitoring value**: Large deposits TO exchanges signal selling pressure. Large withdrawals FROM exchanges signal accumulation. Exchange cold wallet movements indicate operational changes or security events.
- **Identification signals**: Interact with deposit/withdrawal contracts, receive transactions from thousands of unique addresses, hold 50+ different tokens, labeled in Etherscan/Arkham/Nansen

### Whale Wallets
- **Definition**: Non-exchange wallets holding >$1M in a single token or >$10M total portfolio value
- **Sub-types**:
  - **OG Whales**: Early adopters who accumulated during early stages. Often hold large ETH/BTC positions from 2016–2018 era. Movements are rare but impactful.
  - **Institutional Whales**: Fund wallets, family offices, treasury management. Characterized by large but methodical transactions, often interact with OTC desks rather than DEXs.
  - **Degen Whales**: High-risk traders who concentrate in fewer positions. Frequent DEX interactions, leverage usage, meme token positions. Move fast and generate alpha signals.
- **Monitoring value**: Whale accumulation precedes price increases. Whale distribution precedes price drops. Whale wallet creation for a new token signals early-stage interest from sophisticated money.

### Smart Money
- **Definition**: Wallets with a demonstrably profitable trading history — consistently early to tokens that appreciate significantly
- **Identification criteria**:
  - Win rate >60% on tokens held for >7 days
  - Average ROI per position >3x
  - Enters positions before major price moves (not during)
  - Interacts with new contracts within first 24 hours of deployment
  - Uses advanced DeFi strategies (MEV, arbitrage, yield optimization)
- **Notable databases**: Nansen Smart Money labels, Arkham Intelligence entity labels, DeBank whale tracking, custom-built smart money trackers
- **Monitoring value**: Following smart money entries and exits provides alpha. When multiple smart money wallets accumulate the same token simultaneously, it is a strong directional signal.

### Bridge and Cross-Chain Wallets
- **Characteristics**: Interact with bridge contracts (Wormhole, LayerZero, Stargate, Across, Orbiter), hold assets on multiple chains, show correlated activity across chains
- **Common bridges by chain**:
  - Ethereum <-> Arbitrum/Optimism: Native bridges, Across, Stargate
  - Ethereum <-> Solana: Wormhole, deBridge
  - Ethereum <-> BSC: Multichain (deprecated/compromised), Stargate, cBridge
  - Ethereum <-> Base: Native bridge, Across
  - Multi-chain: LayerZero (OFT standard), Axelar, Chainlink CCIP
- **Monitoring value**: Large bridge flows indicate capital migration between ecosystems. Unusual bridge patterns may signal arbitrage opportunities, airdrop farming, or fund laundering.

### Protocol Treasuries and DAOs
- **Characteristics**: Controlled by multisig (Gnosis Safe), governed by on-chain voting, hold project's native token + stablecoins, spend patterns correlate with governance proposals
- **Monitoring value**: Treasury diversification signals (selling native token for stables) can indicate team sentiment. Unusual treasury movements outside of governance may signal compromise or insider activity.

### VC and Fund Wallets
- **Characteristics**: Receive tokens from vesting contracts, hold positions across many protocols, sell on predictable schedules (quarterly unlocks), interact with OTC desks
- **Identification**: Often labeled in vesting contract event logs. Major VCs (a16z, Paradigm, Polychain, Dragonfly, Multicoin, Framework) have known wallet clusters.
- **Monitoring value**: VC unlock schedules create predictable selling pressure. When VCs hold past their unlock date, it's a bullish signal. When they dump immediately at unlock, it's bearish.

### Developer / Deployer Wallets
- **Characteristics**: Deploy smart contracts, interact with admin/owner functions, receive allocations from token distribution contracts
- **Monitoring value**: Developer wallet movements are critical security signals. If a deployer starts moving team tokens to exchanges before scheduled, it may indicate an impending rug or exit. Monitor for: calls to admin functions (pause, mint, changeOwner), transfers to new unmarked wallets, interaction with mixer contracts.

## Transaction Pattern Recognition

### Accumulation Patterns
- **Steady buying**: Regular purchases at consistent intervals (DCA behavior) — often institutional or smart money
- **Dip buying**: Concentrated purchases during price drops — indicates conviction and willingness to average down
- **Multi-wallet accumulation**: Same entity buying through multiple wallets to avoid detection — look for wallets funded from the same source, buying the same token, within the same time window
- **OTC accumulation**: Large amounts acquired without DEX/CEX activity — indicated by large transfers from known OTC desks or direct peer-to-peer transactions
- **Signal strength**: Multiple accumulation wallets active simultaneously on the same token = strong bullish signal

### Distribution Patterns
- **Gradual selling**: Small, regular sells over days/weeks — institutional profit-taking or vesting unlock sells
- **Exchange deposits**: Large transfers to exchange hot wallets — almost always precedes selling
- **Multi-DEX distribution**: Selling across multiple DEXs to minimize price impact and avoid detection on any single venue
- **LP removal**: Withdrawing liquidity from DEX pools — critical rug signal if done by the project team
- **Signal strength**: Whale + smart money simultaneous distribution = strong bearish signal. Developer wallet distribution = rug alert.

### Rug / Exit Scam Patterns
These patterns, especially in combination, indicate high probability of a rug pull:

| Pattern | Description | Severity |
|---------|-------------|----------|
| Developer LP removal | Team removes liquidity from DEX pools | Critical |
| Mint function calls | New tokens minted to developer wallets | Critical |
| Ownership transfer to burn address | Renouncing ownership after enabling a hidden backdoor | High |
| Multi-sig member changes | Adding unknown signers or reducing threshold | High |
| Large developer-to-exchange transfers | Team tokens moving to CEX deposit addresses | High |
| Sudden approval revocations by insiders | Team revoking their own approvals (cashing out before attack) | Medium |
| Proxy upgrade to new implementation | Contract logic changed without community notice | Medium |
| Bridge-out of treasury assets | Treasury funds bridged to another chain (harder to track) | Medium |

### MEV and Arbitrage Patterns
- **Sandwich attacks**: Transaction A (buy) → victim transaction → Transaction B (sell) in the same block
- **Atomic arbitrage**: Buy on DEX A, sell on DEX B in a single transaction via flash loan
- **Liquidation bots**: Monitor lending protocols and execute liquidations when health factor drops below 1
- **JIT liquidity**: Add concentrated liquidity just before a large swap, remove immediately after

## Alert Trigger Design

### Severity Levels
| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| **Critical** | Immediate risk to funds or protocol security | < 5 minutes | Developer wallet draining LP, multisig compromise, bridge exploit |
| **High** | Significant market-moving event requiring attention | < 1 hour | Whale >$5M deposit to exchange, smart money mass exit from a token, unusual token mint |
| **Medium** | Notable activity worth investigating | < 4 hours | New smart money accumulation, VC unlock sell, unusual bridge flow |
| **Low** | Informational, tracked for pattern analysis | Daily review | Regular whale rebalancing, routine treasury operations, DCA activity |

### Threshold Design Principles
- **Relative thresholds > absolute thresholds**: "$1M transfer" means nothing without context. 10% of a token's total supply moving to an exchange is significant regardless of dollar amount.
- **Dynamic thresholds**: Adjust based on the token's average daily volume. A $500K transfer is noise for ETH but a critical event for a $5M market cap token.
- **Cluster alerts**: A single whale buying $2M is less significant than 5 smart money wallets each buying $200K of the same token in the same hour.
- **Decay and cooldown**: After a major event alert fires, suppress similar alerts for 1 hour to avoid spam. But escalate if the same pattern continues beyond the cooldown.

### Recommended Alert Configurations by Use Case

#### Whale Tracking
- Token transfer > 1% of circulating supply by a single address
- Exchange deposit > 0.5% of circulating supply
- New wallet receives > $500K in a token and begins accumulating
- Known whale wallet inactive for >90 days becomes active

#### Smart Money Following
- Smart money wallet buys a token for the first time
- 3+ smart money wallets accumulate the same token within 24 hours
- Smart money wallet exits a position entirely (sells 100%)
- Smart money wallet interacts with a newly deployed contract (<24 hours old)

#### Security Monitoring
- Developer/deployer wallet transfers tokens to an exchange
- Multisig threshold changed or signer added/removed
- Proxy contract upgraded (implementation address changed)
- Token approval granted to an unverified or <7-day-old contract
- Large outflow from a protocol's TVL (>10% in 1 hour)

#### Portfolio Tracking
- Tracked wallet balance changes by >5% in a single transaction
- New token received by tracked wallet
- Token approval granted from tracked wallet to unknown contract
- Tracked wallet interacts with a flagged/blacklisted address

## Token Approval Risks

### What Are Token Approvals?
When you interact with a DeFi protocol, you typically grant the protocol's smart contract permission to spend your tokens (ERC-20 `approve` function). Many dApps request **unlimited approval** — permission to spend an infinite amount of your tokens at any time.

### Why Unlimited Approvals Are Dangerous
- If the approved contract is compromised or has a vulnerability, the attacker can drain ALL approved tokens from your wallet
- Even after you stop using a protocol, the approval persists until you explicitly revoke it
- Historical examples: BadgerDAO exploit ($120M via malicious approvals), transit swap hack ($23M), multiple phishing sites that request approval to drain wallets

### Approval Risk Scoring
| Risk Level | Criteria |
|------------|----------|
| **Critical** | Unlimited approval to an unverified contract, or contract <30 days old, or contract flagged by security firms |
| **High** | Unlimited approval to a contract not interacted with in >90 days (stale approval) |
| **Medium** | Unlimited approval to a verified, audited contract with active usage |
| **Low** | Limited approval (specific amount) to a verified contract, or approval to a well-known blue-chip protocol (Uniswap, Aave, Compound) |

### Approval Monitoring Actions
- Maintain a list of all outstanding approvals per monitored wallet
- Flag any new approval to an unverified or recently deployed contract
- Alert when a previously approved contract is flagged by security services (Forta, Blocksec)
- Recommend regular approval hygiene: revoke stale approvals using tools like Revoke.cash, Etherscan Token Approval Checker, or Rabby wallet's approval manager

## Wallet Security Scoring

### Scoring Dimensions (0–100 scale)
| Dimension | Weight | Scoring Criteria |
|-----------|--------|------------------|
| **Approval Hygiene** | 25% | Number and risk level of outstanding approvals; stale approvals; unlimited vs limited |
| **Contract Interaction History** | 20% | Has the wallet interacted with known malicious contracts? Phishing sites? Unverified contracts? |
| **Multisig Configuration** | 20% | Is the wallet a multisig? If so, what's the threshold? How many signers? Are signers geographically distributed? (N/A for EOAs, score based on other factors) |
| **Fund Concentration** | 15% | Is value concentrated in one token/protocol, or diversified? High concentration = higher impact from a single exploit |
| **Transaction Patterns** | 10% | Does the wallet show signs of being compromised? (Unusual outflows, interaction with known drainers, approved to phishing contracts) |
| **Recovery Preparedness** | 10% | Does the wallet have a social recovery setup? Is it backed by a hardware wallet? (Often unknowable on-chain, but multisig/smart wallet provides evidence) |

### Score Interpretation
- **80–100**: Strong security posture. Minimal risk exposure.
- **60–79**: Adequate security with some areas for improvement. Review flagged approvals.
- **40–59**: Moderate risk. Multiple stale approvals, some interaction with risky contracts. Recommend immediate cleanup.
- **0–39**: High risk. Critical approvals outstanding, possible compromised interactions, concentrated funds exposure. Urgent action needed.

## Real-Time Monitoring APIs and Data Sources

### Block-Level Data (Raw)
- **Alchemy / Infura / QuickNode**: Node providers with websocket support for real-time events
- **The Graph**: Subgraph indexing for protocol-specific events
- **Chainlink Data Feeds**: Price oracles for threshold calculations

### Labeled Address Databases
- **Arkham Intelligence**: Entity labeling, fund flow visualization, cross-chain tracking
- **Nansen**: Smart money labels, fund flow, token god mode
- **Etherscan/BSCScan Labels**: Community-submitted and verified address labels
- **Chainalysis / Elliptic**: Compliance-grade entity resolution (enterprise)

### Alert and Monitoring Platforms
- **Forta Network**: Decentralized detection network with community-built bots for specific threat patterns
- **OpenZeppelin Defender**: Monitoring and automated response for smart contract operations
- **Tenderly**: Real-time transaction simulation and alerting
- **Blocksec Phalcon**: MEV and exploit detection

### Portfolio and Tracking
- **DeBank**: Multi-chain portfolio tracking with protocol positions
- **Zerion**: Portfolio tracking with DeFi position breakdown
- **Zapper**: Dashboard for DeFi positions and NFTs
- **Defi Llama**: Protocol-level TVL tracking (useful for cross-referencing wallet monitoring)

### Cross-Chain Flow Analysis
- **Wormhole Explorer**: Track cross-chain messages and token transfers via Wormhole
- **LayerZero Scan**: Track OFT transfers and cross-chain messages
- **Axelar Scan**: Track Axelar network cross-chain transfers
- **Dune Analytics**: Custom SQL queries across chain data for flow analysis
