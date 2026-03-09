---
domain: wallet-monitor
topic: wallet-monitoring-best-practices
priority: high
ttl: 90d
---

# Wallet Monitoring — Best Practices

## Watchlist Architecture

### Tiered Watchlist Design
Organize monitored addresses into tiers based on priority and monitoring intensity:

**Tier 1 — Critical Watch (Real-Time)**
- Your own protocol's treasury, multisig, and deployer wallets
- Known attacker addresses (from past exploits in your ecosystem)
- Bridge contracts you depend on
- Monitoring cadence: Every block (websocket subscription)
- Alert latency: <30 seconds

**Tier 2 — High Priority (Near Real-Time)**
- Top 20 whale holders of your token
- Smart money wallets identified as early movers in your sector
- VC fund wallets with your token in their portfolio
- Competitor protocol treasuries
- Monitoring cadence: Every 1–5 minutes (polling)
- Alert latency: <5 minutes

**Tier 3 — Standard Watch (Periodic)**
- Exchange hot wallets (top 10 exchanges)
- Broad whale list (top 100 holders)
- Ecosystem fund wallets
- Monitoring cadence: Every 15–60 minutes
- Alert latency: <1 hour

**Tier 4 — Passive Tracking (Batch)**
- General token holder distribution
- Historical pattern analysis addresses
- Cross-chain flow tracking
- Monitoring cadence: Every 4–24 hours (batch processing)
- Alert latency: Daily summary

### Address Clustering
A single entity often controls many addresses. Effective monitoring requires clustering:
- **Funding source analysis**: Addresses funded by the same origin wallet likely belong to the same entity
- **Temporal correlation**: Addresses active at the same times and interacting with the same contracts
- **Behavioral fingerprinting**: Similar transaction patterns, gas price preferences, contract interaction sequences
- **Known cluster databases**: Use Arkham/Nansen entity labels as a starting point, then extend with your own analysis
- **Cluster maintenance**: Update clusters weekly — entities create new wallets regularly

## Alert Rule Design

### The Signal-to-Noise Ratio Problem
The biggest failure mode in wallet monitoring is alert fatigue. A system that generates 200 alerts per day provides zero value because no one reads them. Design for <10 high-quality alerts per day.

### Rule Construction Framework
Every alert rule should specify:
1. **Trigger condition**: What on-chain event fires the alert?
2. **Context filter**: What conditions must be true for this event to be significant?
3. **Severity classification**: Critical / High / Medium / Low
4. **Notification channel**: Where does the alert go? (Telegram bot, Discord webhook, email, SMS, PagerDuty)
5. **Cooldown period**: How long after firing before this rule can fire again?
6. **Auto-enrichment**: What additional data should be attached to the alert? (Wallet label, historical behavior, token price context)

### Example Rule Set for a DeFi Protocol

```
Rule: whale-exchange-deposit
  Trigger: Token transfer > 1% supply to a labeled exchange address
  Context: Sender is in Tier 2 or Tier 3 whale watchlist
  Severity: High
  Channel: Telegram + Discord
  Cooldown: 2 hours per sender address
  Enrichment: Sender label, % of their holdings transferred,
              30-day price chart, other recent exchange deposits

Rule: smart-money-accumulation
  Trigger: 3+ smart money wallets buy the same token within 4 hours
  Context: Token is in our monitored token list OR is a new token (<7 days)
  Severity: Medium
  Channel: Discord #alpha channel
  Cooldown: 24 hours per token
  Enrichment: Which wallets, amount each bought, token metrics,
              smart money historical win rate for similar entries

Rule: deployer-anomaly
  Trigger: Our deployer wallet calls any function or sends any transaction
  Context: Transaction is NOT in the approved operations whitelist
  Severity: Critical
  Channel: Telegram + SMS + PagerDuty
  Cooldown: None (always alert)
  Enrichment: Function called, parameters, gas price,
              simulation result, recent deployer activity

Rule: approval-risk
  Trigger: Monitored wallet grants unlimited approval to any contract
  Context: Contract is unverified OR deployed <7 days ago OR flagged by Forta
  Severity: High
  Channel: Telegram
  Cooldown: 1 hour per wallet
  Enrichment: Contract details, deployer, audit status, similar approval count
```

### Threshold Calibration Process
1. **Start permissive**: Set thresholds slightly below where you think significance lies
2. **Observe for 7 days**: Count alerts per day, categorize signal vs noise
3. **Tighten**: Increase thresholds until you get 5–15 meaningful alerts per day
4. **Review monthly**: Market conditions change thresholds — bull market volume is 10x bear market

## Cross-Chain Monitoring

### Why Cross-Chain Matters
- Attackers bridge stolen funds to different chains to obscure trails
- Whales position across chains before major moves (bridge ETH to Arbitrum before an Arbitrum token launch)
- Airdrop farmers operate identical strategies across multiple chains simultaneously
- Protocol treasuries diversify across chains — tracking only one chain gives incomplete picture

### Cross-Chain Correlation Technique
1. **Bridge event monitoring**: Subscribe to bridge contract events on all source/destination chains
2. **Amount matching**: When a bridge-out event occurs on Chain A, look for a corresponding bridge-in event on Chain B within 5–30 minutes with matching amount (minus bridge fees)
3. **Address linking**: If the same entity bridges, the source address on Chain A and destination address on Chain B are linked
4. **Activity projection**: Once linked, monitor the destination address for subsequent actions (what did they bridge for?)

### Bridge Flow Dashboard
Track aggregate flows for monitored tokens:
| Period | Chain A -> B | Chain B -> A | Net Flow | Interpretation |
|--------|-------------|-------------|----------|----------------|
| 24h | $5.2M | $1.8M | +$3.4M to B | Capital migrating to Chain B |
| 7d | $28M | $32M | -$4M from B | Capital flowing back to A |

Net flow direction over multiple time periods indicates ecosystem health and capital allocation trends.

## Security Monitoring Protocols

### Incident Detection Checklist
When an anomaly alert fires, run through this checklist:
1. Is this a known operational transaction? (Check approved operations whitelist)
2. Is the affected address labeled? (Exchange, known whale, protocol, etc.)
3. Is the transaction consistent with historical behavior of this address?
4. Are multiple anomalies firing simultaneously? (Correlated anomalies = higher severity)
5. Is there a corresponding event on social media or in governance forums?
6. Does the transaction interact with a recently modified contract?

### Incident Response Tiers
| Tier | Trigger | Actions |
|------|---------|---------|
| **Observe** | Single low-severity anomaly | Log, add to daily report, monitor for escalation |
| **Investigate** | Medium-severity anomaly or 2+ low-severity from same entity | Deep-dive the address, check counterparties, simulate transactions, review contract state |
| **Escalate** | High-severity anomaly or correlated multi-address anomalies | Alert team immediately, pause affected systems if possible, prepare incident report |
| **Emergency** | Critical-severity anomaly (deployer compromise, bridge exploit, mass drainage) | Execute emergency playbook: pause contracts, alert community, coordinate with security partners (Blocksec, Seal 911), begin fund tracing |

### Post-Incident Analysis
After any Escalate or Emergency event:
1. Timeline reconstruction: What happened, in what order?
2. Root cause: How did it happen? (Contract vulnerability, compromised key, social engineering)
3. Impact assessment: How much was lost? Who was affected?
4. Alert system review: Did our monitoring catch it? How fast? What could be improved?
5. Watchlist update: Add attacker addresses, related wallets, and any new patterns to monitoring

## Portfolio Tracking Best Practices

### Dashboard Design for Wallet Tracking
A useful wallet tracking dashboard shows:
- **Summary card**: Total value, 24h change, top holdings
- **Token breakdown**: Each token with balance, USD value, % of portfolio, 24h change
- **DeFi positions**: Active positions in lending, LPing, staking (not just raw token balances)
- **Approval exposure**: Total value of tokens with outstanding unlimited approvals
- **Transaction timeline**: Chronological feed of recent transactions with labels
- **Counterparty map**: Who does this wallet transact with most frequently?

### Historical Analysis Techniques
- **Entry price reconstruction**: Calculate average entry price by analyzing all buy transactions (useful for understanding whale P&L)
- **Holding period analysis**: How long does this wallet typically hold positions? (Short-term trader vs long-term holder)
- **Win/loss ratio**: What percentage of this wallet's closed positions were profitable?
- **Gas spending patterns**: How much does this wallet spend on gas? High gas spending relative to portfolio = active trader, possibly MEV bot
- **Protocol interaction frequency**: Which protocols does this wallet use most? (Indicates sector focus)
