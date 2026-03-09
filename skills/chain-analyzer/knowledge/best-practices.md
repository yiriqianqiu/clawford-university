---
domain: chain-analyzer
topic: analysis-quality-and-methodology
priority: high
ttl: 90d
---

# On-Chain Analysis — Best Practices

## Multi-Source Correlation

### The Three-Source Rule
Never base conclusions on a single data source. Verify findings across at least three independent sources:
1. **Block explorer** (Etherscan/BSCScan): Raw transaction data, verified contract code
2. **Analytics platform** (Dune/Nansen): Decoded events, labeled addresses, aggregated metrics
3. **Protocol-specific data** (subgraphs, dashboards): Protocol-native context and metadata

### Cross-Reference Checklist
- Transaction data from explorer matches analytics platform query results
- Address labels are consistent across platforms (or discrepancies are noted)
- Token balance snapshots match between explorer and portfolio trackers
- Historical data is consistent — no gaps in coverage that could hide activity

## Confidence Scoring

### Attribution Confidence Levels
Every claim about wallet ownership or intent should carry a confidence level:

| Level | Criteria | Example |
|-------|----------|---------|
| **High (80-100%)** | On-chain proof: ENS name, verified label across 2+ platforms, public disclosure | "This is Binance Hot Wallet 1 (labeled on Etherscan, Nansen, Arkham)" |
| **Medium (50-79%)** | Strong circumstantial evidence: funding patterns, behavioral signature, timing correlation | "This wallet is likely associated with Fund X based on funding source and trading pattern match" |
| **Low (20-49%)** | Weak signals: partial pattern match, single-source label, geographic inference from timing | "This wallet may be related to Entity Y based on similar transaction timing" |
| **Speculative (<20%)** | Hypothesis only: no direct evidence, inference from association | "It is possible this wallet is connected to Z, but evidence is insufficient" |

### Escalation Protocol
- Start with low confidence and upgrade as evidence accumulates
- Document each piece of evidence and its source
- Note contradictory evidence — do not suppress it to maintain a narrative
- Clearly separate facts (on-chain data) from interpretation (what it means)

## Temporal Analysis

### Time-Window Selection
- **Micro (minutes-hours)**: MEV activity, sandwich attacks, frontrunning detection
- **Short (days-weeks)**: Trading patterns, accumulation/distribution phases, whale movements
- **Medium (weeks-months)**: Protocol adoption trends, holder distribution evolution, treasury movements
- **Long (months-years)**: Token lifecycle analysis, project health assessment, long-term holder behavior

### Change Detection
- Compare current metrics against historical baselines
- Flag statistically significant deviations: >2 standard deviations from 30-day average
- Track rate of change, not just absolute values — acceleration in exchange inflows is more significant than a single large deposit
- Overlay on-chain events with price action for causality analysis (but remember: correlation is not causation)

## Report Structure

### Standard Intelligence Report Format
1. **Executive Summary**: Key findings in 2-3 sentences, highest-impact conclusions
2. **Target Definition**: Address(es), chain(s), time period, analysis scope
3. **Profile**: Wallet classification, activity summary, key metrics
4. **Fund Flow Map**: Source of funds, destination of funds, intermediary paths
5. **Pattern Analysis**: Behavioral patterns, anomalies detected, temporal trends
6. **Risk Assessment**: Exposure mapping, suspicious activity flags, confidence levels
7. **Data Sources**: List all sources used and their limitations
8. **Recommendations**: Suggested next steps, deeper analysis areas, monitoring triggers

### Visualization Recommendations
- Fund flow: Sankey diagrams for value flows between entities
- Transaction graphs: Force-directed graphs for address relationships
- Time series: Line charts for balance changes, volume trends, exchange flows
- Distribution: Pie/treemap for holder concentration, stacked bars for token allocation evolution

## Chain-Specific Considerations

### Ethereum
- Check internal transactions (traces) — they reveal value movement within contract calls that outer transactions do not show
- EIP-1559 base fee and priority fee reveal urgency of transactions
- Flashbot bundles are not visible in the public mempool — check Flashbots Protect and MEV-Boost relay data

### BSC
- Faster finality means shorter analysis windows for time-sensitive patterns
- Higher transaction throughput creates larger datasets — optimize queries for performance
- Validator set is smaller and more centralized — consider validator-level analysis for MEV

### Solana
- Program logs and inner instructions are the equivalent of Ethereum events and internal transactions
- Compute unit consumption indicates transaction complexity
- Vote transactions dominate block space — filter them out for application-level analysis
- Account rent and state compression affect how data is stored and queried
