---
domain: chain-analyzer
topic: analysis-anti-patterns
priority: medium
ttl: 90d
---

# On-Chain Analysis — Anti-Patterns

## Data Collection Anti-Patterns

### 1. Single-Source Dependency
- **Problem**: Relying on a single block explorer or analytics platform for all data. Platforms have labeling errors, indexing delays, and coverage gaps. Etherscan labels may be wrong; Nansen may mislabel a wallet category.
- **Symptoms**: Conclusions collapse when checked against a second source; missed transactions that one platform failed to index; incorrect wallet attribution
- **Fix**: Always cross-reference across at least 2-3 sources. Check raw transaction data on a block explorer against decoded data on Dune. Verify labels across Etherscan, Nansen, and Arkham independently.

### 2. Ignoring Internal Transactions
- **Problem**: Analyzing only top-level transactions and missing internal transactions (traces). On Ethereum, a single transaction can trigger dozens of internal value transfers through contract calls. Ignoring traces means missing the majority of fund flows in DeFi interactions.
- **Symptoms**: Balance calculations do not match actual holdings; fund flow appears to dead-end at a contract address; missing DEX trade activity
- **Fix**: Always include internal transactions/traces in fund flow analysis. Use Etherscan's "Internal Txns" tab or Dune's `ethereum.traces` table. On Solana, check inner instructions.

### 3. Snapshot Bias
- **Problem**: Analyzing a single point-in-time snapshot instead of tracking changes over time. A whale holding 5% of supply now may have held 20% last week — the snapshot misses the distribution event.
- **Symptoms**: Misleading holder concentration metrics; missed accumulation/distribution phases; false sense of stability
- **Fix**: Always analyze time-series data. Track balance changes over days/weeks. Compare current holder distribution against 7-day, 30-day, and 90-day snapshots.

## Interpretation Anti-Patterns

### 4. Attribution Overconfidence
- **Problem**: Assigning definitive ownership to a wallet based on thin evidence. One transaction to a known entity does not make the source wallet part of that entity. Deposit addresses, OTC desks, and payment services create false associations.
- **Symptoms**: Confident claims like "This is definitely [Entity]'s wallet" based on a single transfer; conspiracy-grade connection maps with weak links
- **Fix**: Use explicit confidence levels (high/medium/low/speculative). Require multiple independent signals for medium+ confidence. Document the evidence chain and note alternative explanations.

### 5. Causation from Correlation
- **Problem**: Inferring causation from temporal correlation. "The whale bought, then the price went up" does not mean the whale caused the price increase. Thousands of actors are trading simultaneously.
- **Symptoms**: Narratives that attribute price movements to specific wallet activity; overfitting explanations to cherry-picked transactions
- **Fix**: Present temporal correlations as observations, not explanations. Quantify the relative size of the whale's activity against total market volume. Note alternative causes. Use language like "coincided with" rather than "caused."

### 6. Survivorship Bias in Smart Money Tracking
- **Problem**: Labeling wallets as "smart money" based on past profitable trades without accounting for their losses. A wallet that made 10x on one token may have lost on nine others. Tracking only winners creates misleading signals.
- **Symptoms**: Following "smart money" wallets that produce below-average returns when tracked forward; overweighting a single spectacular trade
- **Fix**: Evaluate smart money labels based on aggregate portfolio performance, not individual trades. Check win rate AND average return. Backtest smart money signals against random wallet selection as a control.

### 7. Ignoring the Exchange Gap
- **Problem**: Tracing funds into an exchange deposit address and then claiming to trace them out through a withdrawal. Once funds enter a centralized exchange, the on-chain trail breaks completely. The exchange commingles all deposits — there is no on-chain link between a specific deposit and a specific withdrawal.
- **Symptoms**: Fund flow diagrams that draw lines through exchange hot wallets as if the specific funds are tracked; false linkages between unrelated wallets
- **Fix**: Flag exchange interactions as trail-breaking events. Mark the on-chain trail as "broken" at the exchange boundary. Note: "Funds deposited to Exchange X — on-chain tracing cannot continue beyond this point." Temporal and amount heuristics can suggest possible continuations but must be labeled as speculative.

## Scope Anti-Patterns

### 8. Boiling the Ocean
- **Problem**: Attempting to analyze every transaction for every address in a token's holder list. This produces overwhelming data with no actionable insight. A token with 50,000 holders cannot be analyzed address-by-address.
- **Symptoms**: Analysis takes hours/days and produces no clear findings; reports are data dumps rather than intelligence; paralysis from too much information
- **Fix**: Start with the top holders (top 10-20 by balance), known entity addresses, and statistically anomalous activity. Use aggregated metrics (Gini coefficient, concentration ratios) before diving into individual addresses. Focus on the question being asked, not exhaustive coverage.

### 9. Recency Bias
- **Problem**: Focusing only on recent transactions and ignoring historical context. A wallet that has been accumulating for 2 years tells a different story than one that bought everything yesterday, even if current balances are identical.
- **Symptoms**: Misclassifying long-term holders as recent buyers; missing the historical relationship between addresses; ignoring past exploit or scam involvement
- **Fix**: Always check wallet age (first transaction date) and historical activity patterns. Look at the full lifecycle, not just the last 30 days. Check if addresses were involved in past incidents (hacks, rugs, sanctions).

### 10. Chain Tunnel Vision
- **Problem**: Analyzing activity on a single chain while the address is active across multiple chains. A whale might accumulate on Ethereum, bridge to BSC for a DEX launch, and use Solana for daily trading. Single-chain analysis misses the full picture.
- **Symptoms**: Incomplete fund flow analysis; missing the majority of an entity's activity; false conclusions about inactivity
- **Fix**: Check the same address (or entity) across all major chains. Use cross-chain analytics platforms (Arkham, DeBank) that aggregate multi-chain activity. Flag bridge interactions as signals that analysis should expand to the destination chain.

## Reporting Anti-Patterns

### 11. Data Dump Without Narrative
- **Problem**: Presenting raw transaction lists, address tables, and balance snapshots without explaining what they mean. The recipient receives data but not intelligence.
- **Symptoms**: Reports that require the reader to re-do the analysis to extract insights; no executive summary; no prioritized findings
- **Fix**: Lead with findings, not data. Structure reports as: conclusion first, then evidence, then raw data appendix. Every data table should have a heading that states what it shows and why it matters.

### 12. Omitting Limitations
- **Problem**: Presenting analysis findings as complete and definitive without disclosing blind spots, coverage gaps, and confidence levels. All on-chain analysis has limitations — privacy tools, CEX gaps, unindexed chains, and labeling errors.
- **Symptoms**: Reports that read as certain when they are probabilistic; no mention of what could not be determined; clients make decisions based on incomplete understanding of analysis confidence
- **Fix**: Every report must include a "Limitations" section listing: chains not covered, time periods with potential gaps, exchange interactions that break trails, privacy tool usage detected, and overall confidence assessment.
