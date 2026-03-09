---
strategy: chain-analyzer
version: 1.0.0
steps: 6
---

# On-Chain Analysis Strategy

## Step 1: Define Analysis Target
- Parse the user's request to identify: **target address(es)**, **chain(s)**, **token(s)**, **time period**, and **analysis objective**
- Classify the analysis type:
  - **Address profiling**: Who is this wallet? What do they do?
  - **Fund flow tracing**: Where did these funds come from / go to?
  - **Whale tracking**: What are large holders doing with a specific token?
  - **Pattern detection**: Is there wash trading, sybil activity, or coordinated manipulation?
  - **Protocol analysis**: How is a protocol's treasury, liquidity, or user base behaving?
- IF the target is vague THEN ask one clarifying question about the specific address, token, or chain
- IF the target is well-defined THEN note the chain type (EVM, Solana, multi-chain) to select appropriate data sources
- OUTPUT: Clear analysis brief — target, chain, time period, objective, expected deliverable format

## Step 2: Collect On-Chain Data
- SELECT data sources based on chain and analysis type:
  - Block explorer (Etherscan/BSCScan/Solscan): raw transaction history, token transfers, contract interactions
  - Analytics platform (Dune/Nansen/Arkham): decoded events, labeled addresses, aggregated metrics
  - Protocol-specific: subgraphs, dashboards, governance forums for protocol context
- GATHER primary data:
  - Transaction history (including internal transactions/traces)
  - Token transfer events (ERC-20 Transfer, ERC-721 Transfer)
  - Token balances (current and historical snapshots)
  - Contract interaction log (which protocols, which functions)
  - Address labels from multiple platforms
- FLAG data gaps: unindexed chains, exchange boundaries, privacy tool usage, time periods with missing data
- VERIFY data consistency across sources — note any discrepancies
- OUTPUT: Raw data inventory with source attribution and coverage notes

## Step 3: Profile Addresses
- FOR EACH target address, build a behavioral profile:
  - **Classification**: Whale, smart money, MEV bot, exchange, protocol treasury, farmer, retail (from knowledge/domain.md taxonomy)
  - **Activity summary**: First seen date, total transactions, most interacted protocols, primary tokens held
  - **Behavioral patterns**: Transaction frequency, gas usage patterns, time-of-day activity, token interaction breadth
  - **Labels**: Cross-reference labels from Etherscan, Nansen, Arkham — note agreement/disagreement
- FOR address clustering:
  - Check if address is part of a known entity cluster (exchange, fund, protocol)
  - Trace funding source: where did the address get its initial gas/tokens?
  - Identify related addresses: same deployer, same funding source, coordinated transaction timing
- ASSIGN confidence level to each profile element (high/medium/low/speculative)
- OUTPUT: Address profile cards with classification, activity summary, and confidence ratings

## Step 4: Trace Fund Flows
- MAP the flow of value using the tracing methodology from knowledge/domain.md:
  - Direct transfers: follow native token and ERC-20 Transfer events hop by hop
  - DEX swaps: track token denomination changes through swap events
  - Bridge transfers: identify cross-chain movements via bridge contract interactions
  - Lending/borrowing: track deposits, borrows, and repayments as indirect fund flows
- DETECT flow patterns:
  - Accumulation (many sources → one target)
  - Distribution (one source → many targets)
  - Layering (multi-hop obfuscation)
  - Round-tripping (funds return to origin via different path)
  - Consolidation (multiple related wallets → single collection point)
- FLAG trail-breaking events:
  - Exchange deposits (on-chain trail breaks at CEX boundary)
  - Privacy tool interactions (Tornado Cash, Railgun — flow becomes probabilistic)
  - Multi-chain bridges (analysis must extend to destination chain)
- OUTPUT: Fund flow map with annotated paths, intermediaries, and confidence levels

## Step 5: Identify Patterns & Anomalies
- ANALYZE the collected data for notable patterns:
  - **Whale behavior**: Large accumulation or distribution events, timing relative to news/governance events
  - **Smart money signals**: Early positioning before price moves, accumulation during downturns
  - **Wash trading indicators**: Same-value round-trips, self-dealing between controlled wallets, inflated volume
  - **Sybil patterns**: Many similar wallets with identical interaction patterns, funded from common source
  - **Exploit/scam indicators**: Rapid fund extraction, interaction with known exploit contracts, flash loan patterns
- COMPARE against baselines:
  - Current metrics vs. 7-day/30-day/90-day averages
  - Target activity vs. peer group (similar-sized wallets, similar protocols)
  - Statistical anomaly detection: flag values >2 standard deviations from historical norms
- CORRELATE with external context:
  - Token price movement around detected events
  - Governance proposals or protocol announcements
  - Market-wide events (liquidation cascades, major hacks)
- OUTPUT: Pattern analysis with evidence, anomalies flagged, and contextual correlation

## Step 6: Generate Intelligence Report
- STRUCTURE the report following best practices from knowledge/best-practices.md:
  - **Executive Summary**: 2-3 sentence overview of key findings
  - **Target Definition**: Address(es), chain(s), time period, analysis scope
  - **Profile**: Wallet classification, behavioral summary, key metrics
  - **Fund Flow**: Annotated flow map with confidence levels
  - **Patterns & Anomalies**: Detected patterns with evidence and significance assessment
  - **Risk Flags**: Suspicious activity, exposure risks, concentration concerns
  - **Limitations**: Data gaps, confidence caveats, chain coverage limitations
  - **Recommendations**: Next steps for deeper analysis, monitoring suggestions, action items
- SELF-CHECK:
  - Are all findings supported by cited data sources?
  - Are confidence levels assigned to every attribution claim?
  - Are limitations and blind spots disclosed?
  - Is the report actionable — does the reader know what to do next?
  - Are anti-patterns from knowledge/anti-patterns.md avoided (no single-source dependency, no attribution overconfidence, no data dumps)?
  - IF any check fails THEN revise the relevant section before delivery
