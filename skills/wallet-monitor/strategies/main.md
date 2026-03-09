---
strategy: wallet-monitor
version: 1.0.0
steps: 6
---

# Wallet Monitoring Strategy

## Step 1: Define Monitoring Objectives and Scope
- Parse the user's request to identify: **monitoring objective**, **target addresses/tokens**, **chains**, **time horizon**, **team size/resources**
- Classify the monitoring objective:
  - **Whale Tracking**: Follow large holders to detect accumulation/distribution patterns for trading alpha
  - **Security Monitoring**: Protect your protocol's funds by monitoring treasury, deployer, and dependency contracts
  - **Smart Money Following**: Identify and copy profitable wallets' trading behavior
  - **Competitor Analysis**: Track competitor protocol treasuries, partnerships, and ecosystem positioning
  - **Incident Investigation**: Trace funds after a hack, exploit, or suspicious event
  - **Compliance Monitoring**: Track addresses for regulatory or legal requirements
- Determine scope constraints:
  - Which chains? (Ethereum, Solana, BSC, Arbitrum, Base, etc.)
  - How many addresses? (5 addresses = manual monitoring feasible; 500 = need automation)
  - What tokens are relevant? (All tokens, or specific token focus?)
  - What is the acceptable alert latency? (Real-time = websockets needed; hourly = polling sufficient)
  - What notification channels are available? (Telegram, Discord, email, SMS, PagerDuty)
- OUTPUT: Monitoring brief with objective, scope, chains, address count estimate, and latency requirements

## Step 2: Build and Classify the Watchlist
- Based on the monitoring brief, construct the address watchlist:

### For Whale Tracking
1. Identify the token(s) to monitor
2. Pull the top 50–100 holders from chain explorers or analytics platforms
3. Label known addresses (exchanges, contracts, burn addresses, team wallets)
4. Remove exchange addresses and contract addresses — focus on EOAs and multisigs
5. Classify remaining wallets by entity type using knowledge/domain.md:
   - Known whales (publicly labeled)
   - VC fund wallets (identified by vesting contract interactions)
   - Smart money (identified by historical profitability)
   - Unknown large holders (to be monitored and classified through behavior)
6. Cluster addresses belonging to the same entity using funding source analysis

### For Security Monitoring
1. List all protocol-controlled addresses: treasury, deployer, multisig, vesting contracts
2. List all critical dependency addresses: oracle contracts, bridge contracts, DEX routers used by the protocol
3. List all admin/owner addresses that can call privileged functions
4. Add known attacker addresses from past exploits in the ecosystem
5. Add bridge contracts used for cross-chain operations

### For Smart Money Following
1. Start with labeled smart money databases (Nansen, Arkham)
2. Apply additional filters: win rate >60%, average ROI >3x, active in last 30 days
3. Focus on wallets active in the sector you care about (DeFi, NFTs, memecoins, etc.)
4. Limit to 20–30 wallets to maintain signal quality
5. Track their entries, not just their holdings (new positions are the signal)

- ASSIGN each address to a monitoring tier (Tier 1–4) from knowledge/best-practices.md
- LABEL each address with: entity type, name (if known), source of label, confidence level
- OUTPUT: Structured watchlist with address, chain, tier, entity type, label, and confidence

## Step 3: Configure Alert Rules
- Design alert rules based on the monitoring objective:

### Rule Design Process
1. For each monitoring tier, define which events are relevant:
   - Tier 1: ALL transactions (including gas top-ups)
   - Tier 2: Token transfers above threshold, contract interactions, approval changes
   - Tier 3: Large transfers only (>0.5% of supply or >5x average)
   - Tier 4: Aggregate daily/weekly summaries only
2. For each relevant event type, define trigger conditions:
   - What on-chain event or transaction pattern triggers the alert?
   - What context filters reduce false positives? (See knowledge/anti-patterns.md for common pitfalls)
   - What severity level does this alert carry?
3. Define notification routing:
   - Critical: Immediate push to all channels (Telegram + SMS + PagerDuty)
   - High: Immediate push to primary channel (Telegram or Discord)
   - Medium: Batched into 4-hourly digests
   - Low: Included in daily summary report
4. Set cooldown periods per rule to prevent alert spam
5. Define auto-enrichment data to attach to each alert

### Anti-Pattern Checklist for Rules
Before finalizing rules, verify against knowledge/anti-patterns.md:
- [ ] Thresholds are relative to token supply/volume, not fixed dollar amounts
- [ ] Internal transfers are filtered (same-entity cluster check)
- [ ] Aggregation windows catch distributed activity (not just single-transaction)
- [ ] Approval events are monitored, not just transfers
- [ ] Cross-chain flows are correlated through bridge event matching
- [ ] A calibration period is planned before going fully live

- OUTPUT: Complete alert rule set with trigger conditions, severity, routing, cooldowns, and enrichment specs

## Step 4: Set Up Cross-Chain Monitoring
- IF the monitoring scope covers multiple chains THEN:
  1. Identify which bridges connect the relevant chains
  2. Add bridge contract addresses to the Tier 2 watchlist on all chains
  3. Configure bridge-event correlation rules:
     - Monitor bridge-out events on source chain
     - Match with bridge-in events on destination chain (amount matching with fee tolerance)
     - Link source and destination addresses as same entity
  4. For each cross-chain link discovered:
     - Add the destination address to the appropriate watchlist tier
     - Apply the same monitoring rules as the source address
  5. Build a cross-chain flow dashboard:
     - Net flow direction and volume per chain pair per time period
     - Unusual flow spikes (>3x average daily bridge volume)
     - Correlation between bridge flows and price movements on destination chain

- IF the monitoring scope is single-chain THEN:
  - Still monitor bridge contracts on that chain for outflows
  - Large bridge-out events from monitored wallets indicate capital leaving the ecosystem
  - Note: single-chain monitoring is inherently incomplete for sophisticated actors

- OUTPUT: Cross-chain monitoring configuration with bridge pairs, correlation rules, and flow dashboard specs

## Step 5: Design the Monitoring Dashboard
- Based on the monitoring objective, design the output dashboard:

### Whale Tracking Dashboard
- **Summary panel**: Top 10 whale activity in last 24h (largest moves, accumulation/distribution signals)
- **Token flow**: Net whale flows (accumulation vs distribution) over 7d, 30d
- **Alert feed**: Chronological stream of triggered alerts with severity colors
- **Wallet deep-dive**: Click any address to see: balance history, transaction timeline, counterparties, DeFi positions, P&L estimate
- **Heatmap**: Which tokens are whales accumulating vs distributing (color-coded)

### Security Dashboard
- **Health status**: Green/yellow/red per monitored address based on recent activity
- **Approval exposure**: Total value at risk from outstanding unlimited approvals
- **Dependency status**: Health check on all monitored dependencies (oracles, bridges, lending markets)
- **Incident timeline**: If an incident is active, real-time transaction trace with annotations
- **Response checklist**: Current response tier and completed/pending actions

### Smart Money Dashboard
- **Signal feed**: New positions opened by smart money wallets in last 24h
- **Confluence detector**: Tokens being accumulated by 3+ smart money wallets (strongest signal)
- **Performance tracker**: Win rate and ROI of followed wallets over rolling 30d period
- **Exit alerts**: Smart money wallets exiting positions (bearish signal per token)

- OUTPUT: Dashboard specification with panels, data sources, and refresh cadence

## Step 6: Establish Response Protocols and Maintenance
- Define response protocols for each alert severity:

### Response Playbooks
- **Critical Alert Playbook**: Who is on-call? What actions are pre-authorized? (Contract pause, fund migration) Who approves escalation? What is the communication protocol? (Internal first, community second) Include contact list for: security partners (Blocksec, Seal 911), bridge operators, exchange security teams
- **High Alert Playbook**: Who investigates? What is the investigation checklist from knowledge/best-practices.md? What threshold escalates to Critical? How is the investigation documented?
- **Medium/Low Alert Playbook**: Who reviews the digest? What patterns in medium alerts trigger a High investigation? Monthly trend analysis protocol

### Maintenance Schedule
| Task | Frequency | Description |
|------|-----------|-------------|
| Watchlist review | Monthly | Add new relevant addresses, remove inactive ones, update labels |
| Threshold recalibration | Monthly | Adjust for token price changes, volume changes, market conditions |
| Smart money re-evaluation | Quarterly | Re-run profitability criteria, remove degraded wallets, add new performers |
| Alert rule audit | Quarterly | Review false positive rate per rule, tune or retire underperforming rules |
| Full system test | Quarterly | Simulate a critical event and verify end-to-end: detection -> alert -> notification -> response |
| Cross-chain bridge update | Monthly | Verify bridge contracts haven't changed, add new bridges |
| Dependency graph review | Monthly | Check if protocol dependencies have changed (new integrations, deprecated protocols) |

### Continuous Improvement
- Track metrics on the monitoring system itself:
  - Alert-to-action ratio: What percentage of alerts led to a meaningful action?
  - Detection latency: How long between on-chain event and alert delivery?
  - False positive rate: What percentage of High/Critical alerts were false alarms?
  - Miss rate: Were there significant events that the system failed to detect? (Discovered through post-mortem)
- Improve based on misses: Every undetected significant event should result in a new or refined alert rule

- OUTPUT: Response protocol documentation, maintenance calendar, and monitoring system health metrics
