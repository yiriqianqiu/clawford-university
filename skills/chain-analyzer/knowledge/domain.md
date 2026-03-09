---
domain: chain-analyzer
topic: on-chain-analysis-fundamentals
priority: high
ttl: 90d
---

# On-Chain Analysis — Domain Knowledge

## Blockchain Explorer Platforms

### Etherscan (Ethereum)
- The canonical block explorer for Ethereum mainnet and testnets
- Key data points: transaction history, internal transactions, token transfers (ERC-20/721/1155), contract source code, event logs
- Labels database: known exchange addresses, protocol contracts, whale wallets, bridge contracts
- API rate limits: 5 calls/sec (free), 10 calls/sec (Pro) — plan analysis batches accordingly
- Advanced features: token approval checker, contract diff tool, verified proxy implementation viewing
- Internal transactions (traces) are critical — they reveal contract-to-contract value flows invisible in standard transaction lists

### BSCScan (BNB Smart Chain)
- Fork of Etherscan for BSC — same interface patterns, different data
- Key differences from Ethereum: faster block times (3s vs 12s), lower gas fees, higher transaction volume per block
- BSC-specific patterns: heavy PancakeSwap activity, BSC token factory deployments, bridge activity from Ethereum
- BEP-20 token tracker mirrors ERC-20 patterns but watch for BSC-specific scam token prevalence

### Solscan / Solana FM (Solana)
- Account-based model differs fundamentally from Ethereum's account model — Solana uses program-derived addresses (PDAs)
- Token accounts are separate from wallet accounts — a single wallet has many associated token accounts
- Transaction structure: Solana transactions contain multiple instructions, each interacting with different programs
- Key programs to track: Token Program, Associated Token Account Program, System Program, and DEX programs (Raydium, Orca, Jupiter)
- Compressed NFTs and token extensions add complexity to holder analysis

## Analytics Platforms

### Dune Analytics
- SQL-based analytics platform for querying decoded blockchain data
- Decoded tables: human-readable event logs and function calls for verified contracts
- Raw tables: blocks, transactions, traces, logs for any on-chain data
- Spellbook: community-maintained data transformation layer with pre-built abstractions for protocols
- Key analysis patterns:
  - `SELECT * FROM dex.trades WHERE token_bought_address = '0x...'` — trade history for a token
  - Join `ethereum.transactions` with protocol-specific decoded tables for enriched analysis
  - Time-series aggregation for trend detection: daily active addresses, volume, unique traders
- Materialized views and query caching for performance on large datasets

### Nansen
- Wallet labeling and smart money tracking platform
- Labels wallets by entity type: fund, smart money, exchange, bridge, airdrop hunter
- Smart Money dashboard: tracks wallets with historically profitable trading patterns
- Token God Mode: comprehensive token analytics including holder distribution, smart money flows, exchange flows
- Key signals: Smart Money accumulation, exchange net flow, DEX vs CEX volume ratio
- Nansen portfolio tracker: aggregate view of labeled wallet activity across chains

### Arkham Intelligence
- Entity-based blockchain intelligence platform with AI-assisted labeling
- Entity pages: aggregated view of all addresses belonging to a single entity (exchange, fund, individual)
- Transaction explorer with visual graph interface for fund flow tracing
- Alert system: set notifications for large transfers, entity activity, or address interactions
- Cross-chain tracking: follows fund flows across bridges and multiple chains
- Historical archive: entity activity timeline for pattern detection over months/years

## Address Profiling Techniques

### Behavioral Fingerprinting
- **Transaction frequency**: Regular intervals suggest bots or scheduled operations; irregular patterns suggest human traders
- **Gas price patterns**: Consistently high gas suggests MEV bots or time-sensitive operations; variable gas suggests manual users
- **Token interaction breadth**: Wide token interaction suggests explorers/farmers; narrow interaction suggests focused traders
- **Contract interaction patterns**: Which protocols an address uses reveals sophistication level and strategy
- **Time-of-day patterns**: Activity clustering in specific hours reveals geographic location and operational patterns

### Wallet Classification Taxonomy
| Type | Indicators |
|------|-----------|
| **Whale** | Large holdings (top 0.1% for a token), infrequent but large transactions, often early token accumulator |
| **Smart Money** | Historically profitable trades, early entry into successful projects, diversified DeFi usage |
| **MEV Bot** | Flashbots/builder transactions, sandwich patterns, high-frequency same-block trading |
| **Exchange Hot Wallet** | Massive transaction volume, labeled by explorers, many small outflows (withdrawals) |
| **Exchange Deposit Address** | Single inflow from user, single outflow to hot wallet, short-lived activity |
| **Protocol Treasury** | Multisig (Gnosis Safe), governance-approved transfers, large stable holdings |
| **Airdrop Farmer** | Sybil-like patterns: many similar wallets, minimum interaction with many protocols, bridging activity |
| **Retail Trader** | Small balances, follows trends, interacts with popular protocols, inconsistent patterns |

### Address Clustering
- **Common spend heuristic**: Addresses that appear as inputs in the same transaction are likely controlled by the same entity (UTXO chains)
- **Deposit address reuse**: Exchange deposit addresses link user wallets to exchange entities
- **Contract deployment**: All contracts deployed by the same EOA are linked; trace deployer chains for project attribution
- **Funding source analysis**: Trace the genesis funding of an address — where did the initial ETH/BNB come from?
- **Timing correlation**: Addresses that transact within narrow time windows in coordinated patterns suggest common control

## Fund Flow Analysis

### Tracing Methodology
1. **Direct transfers**: Follow ETH/BNB/SOL native token transfers and ERC-20 Transfer events between addresses
2. **Multi-hop tracing**: Follow chains of transfers across 3-10 hops, noting intermediary addresses and dwell times
3. **Bridge detection**: Identify cross-chain transfers by monitoring bridge contract deposits (source chain) and corresponding mints (destination chain)
4. **Mixer/privacy tool detection**: Flag interactions with Tornado Cash, Railgun, Aztec, or similar privacy protocols — fund flow becomes probabilistic after mixing
5. **Exchange pass-through**: Detect CEX deposit → CEX withdrawal patterns where the on-chain trail breaks (the "exchange gap")
6. **Token swap obfuscation**: Funds routed through DEX swaps to change the token denomination mid-flow

### Key Flow Patterns
- **Accumulation**: Steady inflows from multiple sources to a single address over time
- **Distribution**: Large balance broken into many smaller outflows to different addresses
- **Layering**: Funds moved through multiple intermediary addresses to obscure origin (classic money laundering pattern)
- **Round-tripping**: Funds leave an address and return through a different path (potential wash trading or self-dealing)
- **Consolidation**: Multiple related addresses sweeping funds to a single collection point

### Exchange Flow Analysis
- **Exchange inflow**: Large deposits to known exchange addresses signal potential sell pressure
- **Exchange outflow**: Large withdrawals from exchanges signal accumulation or cold storage movement
- **Net exchange flow**: Aggregated inflow minus outflow over time — sustained negative flow is bullish (accumulation), positive is bearish (distribution)
- **Stablecoin exchange flow**: Track USDT/USDC flows to exchanges as a leading indicator of buying intent

## Transaction Graph Analysis

### Graph Construction
- Nodes represent addresses; edges represent transfers (weighted by value, labeled by token type)
- Directed graph: edges follow the direction of value transfer
- Temporal layering: add timestamps to edges to enable time-ordered traversal
- Multi-token graphs: separate edge layers for ETH, each ERC-20, and NFTs

### Pattern Detection
- **Star pattern**: One central address connected to many peripherals — typical of distribution events (airdrops, payroll) or collection (exchange deposits)
- **Chain pattern**: Linear sequence of address-to-address transfers — typical of fund laundering or multi-hop obfuscation
- **Cluster pattern**: Dense interconnection between a group of addresses — suggests common ownership or coordinated activity
- **Bipartite pattern**: Two groups of addresses with transfers flowing one direction between groups — typical of market-making or wash trading between controlled wallets

### Wash Trading Detection
- Same value round-trips between a small set of addresses
- Trades on DEXs between wallets funded by the same source
- Artificial volume inflation: high trade count but low unique address count
- NFT wash trading: self-sales at inflated prices to manipulate floor price or earn trading rewards

## Smart Contract Interaction Analysis

### DeFi Protocol Identification
- **Lending**: Aave (supply/borrow events), Compound (mint/redeem cTokens), Venus (BSC equivalent)
- **DEX trading**: Uniswap (Swap events), PancakeSwap (swap functions), Curve (exchange events)
- **Yield farming**: Staking contracts (deposit/withdraw functions), MasterChef-pattern contracts
- **Derivatives**: GMX (position events), dYdX (order events), Synthetix (exchange events)
- **Bridges**: Multichain/Anyswap (LogAnySwapOut), Wormhole (TransferRedeemed), Stargate (Swap events)

### Risk Exposure Mapping
- Identify all protocols an address has active positions in
- Calculate total value at risk across lending positions (liquidation thresholds)
- Map token approval exposure: which contracts have unlimited approval on which tokens
- Flag high-risk interactions: unverified contracts, recently deployed contracts, known exploited protocols
