---
strategy: dex-trader
version: 1.0.0
steps: 6
---

# DEX Trading Strategy

## Step 1: Analyze Market Conditions
- Parse the user's request to identify: **token pair**, **chain**, **trade direction** (buy/sell/LP), **trade size**, and **objective**
- Classify the request type:
  - **Swap optimization**: Find the best execution for a specific trade
  - **LP strategy**: Design a liquidity provision position
  - **Route analysis**: Compare execution paths across DEXs
  - **Risk assessment**: Evaluate an existing position or potential trade
  - **Market microstructure**: Analyze liquidity depth, volume patterns, or MEV risk for a pair
- GATHER market context:
  - Current token prices from multiple sources (DEX spot price, aggregator quote, CEX reference)
  - Pool TVL and 24h volume for relevant pools
  - Recent price volatility (24h, 7d range)
  - Gas conditions on the target chain
- IF the request is vague THEN ask one clarifying question about trade size, chain, or direction
- OUTPUT: Market overview — token pair, chain, current price, liquidity conditions, and analysis objective

## Step 2: Select DEX and Route
- IDENTIFY available liquidity sources for the token pair on the target chain:
  - Major AMMs: Uniswap v2/v3, PancakeSwap, Curve, Balancer, Raydium, Orca
  - Aggregators: 1inch, Jupiter, CowSwap, ParaSwap
  - RFQ/OTC: For large trades, consider off-chain market makers
- EVALUATE each venue:
  - Pool TVL and fee tier
  - 24h trading volume and recent activity
  - Liquidity depth at current price (concentrated liquidity distribution)
  - Fee structure (swap fee + gas cost)
- COMPARE aggregator routes:
  - Single-pool direct swap vs. multi-hop routing
  - Split routes across multiple pools
  - Cross-DEX routing via intermediary tokens
- FOR LP requests:
  - Compare fee tiers and their volume share
  - Analyze existing LP distribution (how competitive is the position)
  - Estimate fee APR based on recent volume
- OUTPUT: Recommended venue(s) with rationale, alternative options ranked by execution quality

## Step 3: Calculate Optimal Trade Parameters
- FOR swap trades:
  - **Price impact**: Model the trade against pool reserves using AMM formulas from knowledge/domain.md
  - **Slippage tolerance**: Recommend based on pair type (0.1% stables, 0.5% majors, 1-3% volatile)
  - **Trade splitting**: If price impact >1%, recommend splitting strategy (TWAP, size-weighted)
  - **Gas estimate**: Calculate gas cost as percentage of trade value
  - **Total execution cost**: slippage + gas + estimated MEV risk
- FOR LP positions:
  - **Range selection**: Recommend range based on pair volatility and strategy (from knowledge/best-practices.md)
  - **Capital efficiency**: Calculate the liquidity multiplier for the recommended range
  - **IL projection**: Model impermanent loss for 3 price scenarios: +50%, -50%, and range-bound
  - **Fee APR estimate**: Based on recent 7-day volume and recommended range
  - **Net APR projection**: Fee APR minus expected IL minus gas costs for rebalancing
- OUTPUT: Specific trade parameters with numerical calculations

## Step 4: Assess MEV Risk
- EVALUATE MEV exposure for the trade:
  - **Trade size**: Trades >$1K on Ethereum are sandwich-viable
  - **Mempool visibility**: Is the transaction going through a public or private mempool?
  - **Pool depth**: Shallow pools are easier to sandwich (less capital required by attacker)
  - **Token volatility**: High volatility increases sandwich profitability
- RECOMMEND protection strategy (from knowledge/domain.md MEV section):
  - CowSwap for batch-auction protection
  - Flashbots Protect for private mempool submission
  - Tight slippage tolerance if MEV protection is not available
  - Timing: execute during low-activity periods when MEV bots are less active
- ESTIMATE MEV cost: approximate the additional slippage from potential sandwich attacks
- OUTPUT: MEV risk assessment (low/medium/high) with specific protection recommendations

## Step 5: Execute Strategy
- COMPILE the execution plan with specific parameters:
  - **For swaps**:
    - Token in, token out, exact amount
    - Recommended DEX or aggregator
    - Slippage tolerance setting
    - Transaction deadline
    - MEV protection method
    - If splitting: number of chunks, timing interval, and execution steps
  - **For LP positions**:
    - Token pair, fee tier, chain
    - Price range [lower, upper] with tick values
    - Capital allocation per token
    - Rebalancing trigger conditions
    - Exit criteria (max IL, time horizon, take-profit)
    - Monitoring frequency
- PRESENT alternative scenarios:
  - **Conservative**: Wider ranges / tighter slippage / smaller position
  - **Moderate**: Balanced parameters based on analysis
  - **Aggressive**: Narrower ranges / larger position / higher risk-reward
- OUTPUT: Step-by-step execution plan with exact parameters for each scenario

## Step 6: Monitor and Risk Report
- DEFINE monitoring parameters for the position:
  - Price alerts at key levels (range boundaries for LP, stop-loss for swaps)
  - Daily fee accrual tracking vs. IL for LP positions
  - Pool TVL change alerts (>10% daily change signals potential issues)
  - Token approval exposure review
- PROVIDE risk summary:
  - **Execution risk**: Probability of failed transaction, slippage exceeding tolerance
  - **Market risk**: Price impact of adverse movement on the position
  - **Smart contract risk**: Protocol audit status, historical exploit history
  - **Liquidity risk**: What happens if pool liquidity drops significantly
  - **MEV risk**: Expected MEV leakage if protection is not used
- SELF-CHECK:
  - Did we consider gas costs in the total cost analysis?
  - Did we model IL for LP positions with specific price scenarios?
  - Did we recommend MEV protection appropriate to the trade size and chain?
  - Did we set specific risk management parameters (stop-loss, exit criteria)?
  - Are the anti-patterns from knowledge/anti-patterns.md avoided (no max slippage, no set-and-forget LP, no unverified tokens)?
  - IF any check fails THEN revise the relevant section before delivery
