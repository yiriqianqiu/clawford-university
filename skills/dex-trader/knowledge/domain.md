---
domain: dex-trader
topic: dex-mechanics-and-amm-fundamentals
priority: high
ttl: 90d
---

# DEX Trading — Domain Knowledge

## AMM Mechanics

### Constant Product Market Maker (Uniswap v2, PancakeSwap v2)
- Core invariant: `x * y = k` where x and y are reserves of the two tokens in the pool
- Price is determined by the ratio of reserves: `price_of_y_in_x = reserve_x / reserve_y`
- When a trader buys token Y with token X: reserve_x increases, reserve_y decreases, k remains constant (plus fees)
- **Price impact formula**: For a trade of size `dx` buying token Y:
  - `dy = (reserve_y * dx) / (reserve_x + dx)` (amount of Y received)
  - Effective price: `dx / dy` (always worse than the spot price due to slippage)
  - Price impact percentage: `dx / (reserve_x + dx)` (approximately `dx / reserve_x` for small trades)
- **Fee mechanism**: 0.3% fee on input amount (Uniswap v2), 0.25% to LPs + 0.05% to protocol (PancakeSwap v2)
- Fee is deducted before the swap calculation: `dx_effective = dx * 0.997`
- **Liquidity is uniform**: Capital is spread evenly across all prices from 0 to infinity — capital inefficient for most pairs

### Concentrated Liquidity (Uniswap v3, PancakeSwap v3)
- LPs deposit liquidity within a specific price range [p_lower, p_upper] instead of across all prices
- Within the selected range, the position behaves like a constant product pool with amplified virtual reserves
- **Capital efficiency**: Concentrating liquidity in a narrow range can provide 100-4000x more depth per dollar compared to v2
- **Tick system**: Price space is divided into discrete ticks; each tick corresponds to a 0.01% price movement (1 basis point)
- **Fee tiers**: Multiple fee levels per pair (typically 0.01%, 0.05%, 0.30%, 1.00%) — LPs select based on pair volatility
  - 0.01%: Stable pairs (USDC/USDT)
  - 0.05%: Highly correlated pairs (ETH/stETH)
  - 0.30%: Standard pairs (ETH/USDC)
  - 1.00%: Exotic/volatile pairs (long-tail tokens)
- **Active liquidity**: Only positions whose range includes the current price earn fees; out-of-range positions earn nothing
- **Position management**: LPs must actively rebalance positions as price moves to stay in range — passive LP is punished

### Stable Swap AMM (Curve Finance)
- Optimized for pairs that should trade near 1:1 (stablecoins, wrapped assets, LSTs)
- Uses the StableSwap invariant: a hybrid between constant-product and constant-sum
- **Amplification coefficient (A)**: Controls the curvature — higher A means flatter curve near the peg, tighter spreads, less slippage for pegged assets
  - A=0 behaves like constant-product; A=infinity behaves like constant-sum (zero slippage at peg)
  - Typical A values: 100-2000 for stablecoin pools
- **Imbalance detection**: When pool reserves deviate from equilibrium, the curve steepens rapidly — this creates arbitrage opportunities that restore the peg
- **Multi-asset pools**: Curve supports 2-4 asset pools (3pool: DAI/USDC/USDT) with generalized StableSwap math

### Weighted Pools (Balancer)
- Generalization of constant product: `product(reserve_i^weight_i) = k`
- Supports unequal weights (e.g., 80/20 ETH/USDC instead of 50/50) — reduces impermanent loss for the overweighted asset
- Up to 8 tokens per pool with arbitrary weights
- **Liquidity Bootstrapping Pool (LBP)**: Weight shifts over time (e.g., 90/10 → 50/50) creating a Dutch-auction-like price discovery for token launches

## Slippage and Price Impact

### Definitions
- **Price impact**: The change in the pool's exchange rate caused by your trade specifically — a function of trade size relative to pool reserves
- **Slippage**: The difference between the expected price at the time of transaction submission and the actual execution price — includes price impact PLUS any price movement between submission and execution
- **Slippage tolerance**: Maximum acceptable deviation from the quoted price — set by the trader as a transaction parameter

### Calculation for Constant Product Pools
For a swap of `dx` token X to buy token Y with reserves `(Rx, Ry)`:
- Amount received: `dy = Ry * dx * (1 - fee) / (Rx + dx * (1 - fee))`
- Spot price before trade: `P = Rx / Ry`
- Effective price: `P_eff = dx / dy`
- Price impact: `(P_eff - P) / P * 100%`
- Rule of thumb: a trade that is 1% of the reserve has approximately 1% price impact

### Minimizing Price Impact
- **Split orders**: Break large trades into smaller chunks executed over time (TWAP strategy)
- **Use aggregators**: 1inch, Jupiter, CowSwap route through multiple pools and DEXs to find depth
- **Time execution**: Avoid low-liquidity hours (early morning UTC for Ethereum, weekends)
- **Limit orders**: Use DEX limit order protocols (1inch Limit Orders, Gelato, CowSwap) to fill at specific prices
- **RFQ systems**: Request-for-quote from professional market makers can offer better execution than AMM pools for large trades

## Impermanent Loss

### Definition
Impermanent loss (IL) is the opportunity cost of providing liquidity to an AMM compared to simply holding the tokens. It occurs when the price ratio of the pooled tokens changes from the ratio at deposit time.

### Formula (Constant Product)
For a price change ratio `r = new_price / entry_price`:
- IL = `2 * sqrt(r) / (1 + r) - 1`
- At 1.25x price change (25% move): IL = -0.6%
- At 1.5x price change (50% move): IL = -2.0%
- At 2x price change (100% move): IL = -5.7%
- At 3x price change (200% move): IL = -13.4%
- At 5x price change (400% move): IL = -25.5%
- IL is symmetric: a 2x increase and a 50% decrease produce the same IL

### IL for Concentrated Liquidity (Uniswap v3)
- Concentrated positions amplify both fee earnings AND impermanent loss
- If price moves outside the LP's range: the position is 100% converted to the less valuable token (maximum IL)
- Narrower ranges = higher capital efficiency but faster IL accumulation
- IL in v3 depends on range width: `IL_v3 = IL_v2 * (liquidity_multiplier)` approximately

### When LPing is Profitable
Net LP return = Trading fees earned - Impermanent loss - Gas costs
- Profitable when: Fee APR > IL rate + gas costs amortized over position duration
- High volume / low volatility pairs: fees exceed IL (stablecoin pools, correlated assets)
- High volatility / low volume pairs: IL dominates fees (avoid LPing new or volatile tokens)
- Calculate breakeven: minimum daily volume required for fees to cover IL at a given volatility

## MEV (Maximal Extractable Value)

### What is MEV
MEV is the profit that block producers (miners/validators) or specialized searchers can extract by reordering, inserting, or censoring transactions within a block. On DEXs, MEV primarily manifests as:

### Sandwich Attacks
1. Attacker sees a pending large swap in the mempool
2. **Frontrun**: Attacker buys the same token before the victim's transaction, moving the price up
3. **Victim's trade**: Executes at a worse price due to the frontrunner's impact
4. **Backrun**: Attacker sells immediately after the victim's trade, capturing the price difference
- Victim loses the difference between their expected price and actual execution price
- Profitability: approximately `victim_trade_size * price_impact_of_frontrun * 2` minus gas costs
- Defense: Set tight slippage tolerance (but risk transaction failure), use private mempools

### Frontrunning
- Searchers monitor the public mempool for profitable pending transactions
- Copy profitable trades and submit with higher gas to execute first
- Applies to: arbitrage opportunities, large swaps, liquidation triggers
- Defense: MEV-protected RPC endpoints (Flashbots Protect, MEV Blocker), private transactions

### JIT (Just-in-Time) Liquidity
- Searcher adds concentrated liquidity in a narrow range right before a large pending swap
- Captures the majority of swap fees for that transaction
- Removes liquidity in the same block after the swap
- Reduces fee income for passive LPs; generally not harmful to traders (may improve execution)

### MEV Protection Tools
- **Flashbots Protect**: Sends transactions directly to block builders, bypassing the public mempool
- **MEV Blocker**: Multi-builder protection by distributing to several builders
- **CowSwap**: Batch auction model — trades are matched off-chain and settled on-chain, inherently MEV-resistant
- **Private mempools**: Chain-specific solutions (e.g., Solana Jito tips to validators for order preference)

## DEX Aggregators

### 1inch
- Splits trades across multiple DEXs and routes through intermediary tokens for optimal pricing
- Fusion mode: gasless limit orders filled by professional resolvers using their own gas
- Supports Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, and more
- Pathfinder algorithm: finds optimal routes including multi-hop swaps through intermediary tokens

### Jupiter (Solana)
- Primary Solana DEX aggregator — routes through Raydium, Orca, Phoenix, Lifinity, and others
- DCA (Dollar Cost Average): automated scheduled swaps over time
- Limit orders: on-chain limit orders that execute when price conditions are met
- Perpetual trading: leveraged trading via Jupiter Perps
- Key advantage: Solana's low fees make multi-hop routing and order splitting economically viable for small trades

### CowSwap
- Batch auction model: collects orders and finds optimal settlement (Coincidence of Wants matching)
- Orders matched peer-to-peer when possible (zero price impact, zero MEV)
- Surplus is returned to traders — execution can be better than best AMM quote
- MEV protection built into the design — no public mempool exposure
- Solver competition: professional solvers compete to find the best execution for each batch

### ParaSwap
- Multi-chain aggregator with MEV protection features
- Augustus smart contract: unified routing through multiple liquidity sources
- Delta: off-chain order matching similar to CowSwap for improved execution
- Rate limiting and quote freshness controls for execution quality

## Liquidity Analysis

### Pool Health Indicators
| Metric | Healthy | Warning | Danger |
|--------|---------|---------|--------|
| **TVL** | >$1M | $100K-$1M | <$100K |
| **24h Volume/TVL** | 0.1-1.0 | 0.01-0.1 | <0.01 or >5.0 |
| **LP Count** | >50 | 10-50 | <10 |
| **Top LP Concentration** | <30% | 30-60% | >60% |
| **Liquidity Lock** | >80% locked | 50-80% locked | <50% or unlocked |

### Liquidity Depth Assessment
- Check order book depth equivalent by simulating trades of increasing size
- 1% depth: the trade size that causes 1% price impact
- For a $10M constant-product pool: 1% depth is approximately $50K
- For concentrated liquidity: depth depends heavily on LP position distribution around current price
- Historical liquidity stability: check if TVL has been growing, stable, or declining over 30 days
