---
domain: dex-trader
topic: execution-quality-and-lp-management
priority: high
ttl: 90d
---

# DEX Trading — Best Practices

## Trade Execution

### Pre-Trade Checklist
Before executing any DEX swap:
1. **Verify the token contract**: Check the contract address against CoinGecko, CoinMarketCap, or the project's official site. Scam tokens often mimic names of legitimate tokens.
2. **Check liquidity depth**: Simulate the trade size against pool reserves. If your trade is >2% of pool reserves, consider splitting.
3. **Compare aggregator quotes**: Check at least 2 aggregators (1inch, Jupiter, CowSwap) for the best route.
4. **Set appropriate slippage tolerance**: 0.1-0.5% for stablecoin swaps, 0.5-1% for major pairs, 1-3% for small-cap tokens. Never set unlimited slippage.
5. **Check gas conditions**: On Ethereum, use gas trackers to time execution during low-gas periods. On BSC/Solana, gas is negligible but still verify.
6. **Verify MEV protection**: Use Flashbots Protect or MEV Blocker for Ethereum mainnet trades. Use CowSwap for large trades.

### Order Splitting Strategies
Large orders should be split to minimize price impact:

- **Time-Weighted Average Price (TWAP)**: Split into N equal parts, execute at regular intervals (every 5-15 minutes). Reduces market impact and averages out short-term volatility.
- **Size-Weighted Splitting**: Split proportionally across DEXs based on their liquidity depth. Aggregators do this automatically.
- **Iceberg Orders**: Show only a small portion of the total order to the market. DEX-native iceberg support is limited; simulate by manual splitting.
- **Threshold rule**: If trade size > 1% of pool TVL, split is mandatory. If >0.5%, splitting is recommended. Below 0.5%, single execution is acceptable.

### Slippage Management
- **Static tolerance**: Fixed percentage — simple but may be too tight (failed transactions) or too loose (MEV extraction)
- **Dynamic tolerance**: Set based on current pool volatility and trade size — tighter for stable pairs, wider for volatile pairs
- **Deadlines**: Always set a transaction deadline (5-20 minutes) to prevent stale transactions executing at unfavorable prices hours later
- **Post-trade verification**: Check the actual execution price against the quoted price. Track cumulative slippage over time to detect systematic execution problems.

## MEV Protection

### Protection Hierarchy (Most to Least Protected)
1. **CowSwap batch auctions**: Best protection — trades never enter public mempool; off-chain matching eliminates sandwich opportunity
2. **Flashbots Protect / MEV Blocker**: Transactions go directly to block builders, hidden from public mempool searchers
3. **Private RPC endpoints**: Chain-specific private submission (Jito on Solana, MEV Blocker on Ethereum)
4. **Low slippage tolerance**: Reduces sandwich profitability but may cause transaction failures on volatile pairs
5. **Small trade sizes**: MEV extraction is only profitable above a minimum trade size (typically >$1K on Ethereum); small trades are naturally protected by gas costs

### When MEV Risk is Highest
- Large single trades (>$10K) on Ethereum mainnet in the public mempool
- Volatile periods with rapidly moving prices (wider slippage tolerance needed, more room for sandwich)
- Low-liquidity pools (smaller capital needed to sandwich)
- Predictable transactions: scheduled buys, recurring DCA trades, known bot patterns

## Liquidity Provision Strategy

### Position Sizing
- Never allocate more than 20% of portfolio to any single LP position
- Account for gas costs: opening and closing positions on Ethereum can cost $50-200 in gas; the position must be large enough for fees to cover gas within a reasonable timeframe
- Minimum viable position: at least $1,000 on Ethereum (gas amortization), $100 on BSC, $10 on Solana

### Range Selection (Concentrated Liquidity)
- **Full range**: Equivalent to Uniswap v2 — lowest capital efficiency, no rebalancing needed, lowest IL risk per unit of liquidity
- **Wide range (current price +/- 50%)**: Moderate capital efficiency (3-5x), monthly rebalancing, suitable for volatile pairs
- **Medium range (current price +/- 20%)**: High capital efficiency (10-20x), weekly rebalancing, suitable for trending pairs
- **Tight range (current price +/- 5%)**: Maximum capital efficiency (50-100x), daily rebalancing, suitable for stable pairs only
- **Asymmetric ranges**: Shift the range in the direction of your market view — wider on the downside if bearish, wider on the upside if bullish

### Fee Tier Selection Guide
| Pair Type | Recommended Fee Tier | Rationale |
|-----------|---------------------|-----------|
| Stablecoin/Stablecoin | 0.01% | Minimal price movement, high volume |
| Correlated assets (ETH/stETH) | 0.05% | Low divergence, high volume |
| Major pairs (ETH/USDC) | 0.30% | Standard volatility, balanced volume |
| Long-tail / new tokens | 1.00% | High volatility, low volume, high IL risk |

### Impermanent Loss Management
- **Monitor price ratio**: If the price has moved >30% from entry, reassess the position
- **Calculate breakeven**: Compare earned fees against current IL; exit if IL exceeds 3 months of projected fee income
- **Hedge with options**: Use on-chain options (Lyra, Premia) or perps to delta-hedge LP positions
- **Pair with correlated assets**: LP in pairs with high correlation (ETH/stETH, BTC/WBTC) for minimal IL
- **Rebalance trigger**: Set rebalancing thresholds — rebalance when price moves >50% of range width

## Risk Management

### Pool Due Diligence
Before providing liquidity:
1. **Contract verification**: Is the pool contract verified on the block explorer?
2. **Liquidity lock**: Is the initial LP locked? Check via token lock platforms (Team Finance, Unicrypt)
3. **Token contract review**: Check for mint functions, hidden fees, transfer restrictions, blacklists
4. **LP concentration**: If one LP controls >50% of the pool, they can rug by removing liquidity
5. **Volume consistency**: Check if volume is organic (varied trade sizes, many unique traders) or potentially wash traded (uniform sizes, few addresses)
6. **Protocol history**: Has the protocol been audited? Any past exploits? Check DeFiSafety, Rekt News

### Position Monitoring
- Check positions at least daily for active (concentrated) LP
- Set price alerts at range boundaries for concentrated positions
- Monitor pool TVL changes — sudden drops signal LP exits and potential issues
- Track cumulative fees vs. IL in real-time using portfolio trackers (Revert Finance, APY.Vision)
- Know your exit plan before entering: define conditions that trigger position closure
