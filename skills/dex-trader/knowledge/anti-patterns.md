---
domain: dex-trader
topic: trading-and-lp-anti-patterns
priority: medium
ttl: 90d
---

# DEX Trading — Anti-Patterns

## Trade Execution Anti-Patterns

### 1. Ignoring Gas Costs
- **Problem**: Executing small trades on Ethereum mainnet where gas costs exceed the trade value or significantly eat into returns. A $50 swap costing $15 in gas is a 30% execution cost before slippage.
- **Symptoms**: Trades where gas is >5% of trade value; multiple small swaps instead of a single batched trade; ignoring L2 options for cost savings
- **Fix**: Calculate total cost (slippage + gas + MEV) as a percentage of trade size BEFORE executing. For trades under $500 on Ethereum, consider L2s (Arbitrum, Base) or alternative chains (BSC, Solana). Batch multiple swaps when possible using aggregators with multi-swap support.

### 2. Maximum Slippage Tolerance
- **Problem**: Setting slippage tolerance to 10%, 20%, or "auto" maximum values to guarantee execution. This invites sandwich attacks and results in execution at significantly worse prices than necessary.
- **Symptoms**: Consistent execution at prices worse than the quote; unexplained value leakage on swaps; sandwich transactions visible before and after your trade in the block
- **Fix**: Start with the minimum viable slippage tolerance for the pair type (0.1% for stables, 0.5% for majors, 1-3% for volatile tokens). If the transaction fails, increase by 0.5% increments. Use MEV protection to reduce the need for loose slippage.

### 3. Trusting Unverified Token Contracts
- **Problem**: Swapping into tokens without verifying the contract address. Scam tokens often appear with the same name and ticker as legitimate tokens but have hidden fees, transfer restrictions (honeypots), or hidden mint functions.
- **Symptoms**: Unable to sell after buying; unexpected fee deductions on transfers; token balance changes without transactions
- **Fix**: Always verify the token contract address against the project's official website, CoinGecko, or CoinMarketCap. Check the contract for: sell restrictions, fee functions, owner mint ability, blacklist functions. Use honeypot detection tools (Honeypot.is, Token Sniffer) before buying unknown tokens.

### 4. Single-Pool Execution for Large Trades
- **Problem**: Executing a large trade through a single pool instead of routing through multiple pools and DEXs. A $100K trade through a $2M pool causes approximately 5% price impact when splitting across multiple pools could reduce it to <1%.
- **Symptoms**: Execution price significantly worse than the market mid-price; high price impact percentage shown on the DEX UI
- **Fix**: Use DEX aggregators (1inch, Jupiter, CowSwap) for any trade >$1K. For very large trades (>$50K), compare aggregator routes and consider OTC desks or RFQ systems. Manual TWAP splitting for trades >$100K.

### 5. Stale Price Execution
- **Problem**: Submitting a transaction during volatile conditions without a deadline, then having it execute minutes or hours later at a price that has moved significantly. Ethereum transactions can sit in the mempool during gas spikes.
- **Symptoms**: Trade executes at a price far from the quote; transactions that were submitted during a pump/dump but executed after the move reversed
- **Fix**: Always set a transaction deadline (5-20 minutes depending on network conditions). Use "swap and send" or limit order functionality when available. Monitor pending transactions and cancel/replace if conditions change.

## Liquidity Provision Anti-Patterns

### 6. Chasing APR Without IL Analysis
- **Problem**: Selecting LP positions based solely on advertised APR/APY without considering impermanent loss. A pool showing 200% APR may have tokens with extreme volatility where IL will exceed fees.
- **Symptoms**: Net negative returns despite high advertised APR; positions where IL exceeds total fees earned; surprise losses when rebalancing or exiting
- **Fix**: Calculate the minimum daily volume needed for fees to cover IL at the pair's historical volatility. Use IL calculators (ImpermanentLoss.com, DeFi tools) to model scenarios. Compare: "Would I be better off just holding these tokens?" If the answer is often "yes," don't LP.

### 7. Set-and-Forget Concentrated Liquidity
- **Problem**: Deploying a concentrated liquidity position and not monitoring it. In Uniswap v3, if the price moves outside your range, you earn zero fees and suffer maximum directional IL — your entire position converts to the less valuable token.
- **Symptoms**: Positions sitting out of range for days/weeks; 100% exposure to the underperforming token; zero fee accrual
- **Fix**: Set price alerts at range boundaries. Check positions daily. Define a rebalancing strategy BEFORE opening the position: under what conditions will you adjust the range? Use active LP management tools (Arrakis, Gamma, Charm) for automated rebalancing if you cannot monitor frequently.

### 8. LP in Low-Volume Pools
- **Problem**: Providing liquidity to pools with minimal trading volume. Fees are earned from trades, so no volume means no income — but you still bear impermanent loss risk.
- **Symptoms**: Dust-level fee accrual over days/weeks; IL growing with no fee offset; liquidity providing a service to zero users
- **Fix**: Check 7-day average daily volume before entering any pool. Calculate minimum volume needed for target APR: `required_daily_volume = target_APR * TVL / (fee_rate * 365)`. If actual volume is less than half this threshold, do not enter.

### 9. Single-Sided IL Misunderstanding
- **Problem**: Providing liquidity to a token you are bullish on, then being surprised that the position underperforms a pure hold when the token goes up. LPing is a short-volatility strategy — you profit from range-bound prices and lose from strong directional moves.
- **Symptoms**: "I'm bullish on ETH so I'll LP ETH/USDC" followed by disappointment when ETH moons and the LP position underperforms holding ETH
- **Fix**: Understand that LPing is a market-neutral strategy at its core. If you have a strong directional view, holding the asset outperforms LPing in that direction. LP positions profit from fees when price oscillates within range. Only LP with capital you are willing to have partially converted to the other token.

## Risk Management Anti-Patterns

### 10. No Exit Strategy
- **Problem**: Entering LP positions or trades without defining exit conditions. "I'll just leave it and see" leads to positions held through crashes, depegs, and rug pulls.
- **Symptoms**: Holding LP through a token crash; riding impermanent loss to -50% without action; no defined take-profit or stop-loss
- **Fix**: Before entering ANY position, define: (1) profit target at which you take fees and exit, (2) maximum loss threshold that triggers position closure, (3) time horizon after which you reassess regardless of P&L. Write these down. Execute them without emotion.

### 11. Ignoring Token Approval Exposure
- **Problem**: Granting unlimited token approvals to DEX contracts and forgetting about them. If a contract is exploited, unlimited approvals allow the attacker to drain all approved tokens from your wallet.
- **Symptoms**: Dozens of unlimited approvals to various DEX routers and protocols; no awareness of which contracts can access your tokens
- **Fix**: Use approval checkers (Etherscan Token Approval Checker, Revoke.cash) to audit approvals regularly. Approve exact amounts instead of unlimited when possible. Revoke approvals for contracts you no longer use. Consider using a separate wallet for DEX trading to limit exposure.

### 12. Rug Pull Liquidity Provision
- **Problem**: Providing liquidity to pools for unaudited or newly launched tokens because of high advertised APR. The project team can rug by removing their LP, minting new tokens, or exploiting contract backdoors.
- **Symptoms**: Token price drops to near zero; LP tokens become worthless; project team vanishes
- **Fix**: Before LPing unknown tokens, check: Is LP locked? (Verify on-chain, not just claimed.) Is the contract verified and audited? Does the contract have owner-privileged functions (mint, pause, fee modification)? Is the team doxxed? Is there active community and development? If any answer is no, do not LP.
