---
domain: token-launcher
topic: launch-anti-patterns
priority: medium
ttl: 90d
---

# Token Launch — Anti-Patterns

## Tokenomics Anti-Patterns

### 1. Insider-Heavy Allocation
- **Problem**: Team and investor allocations exceed 40% of total supply with weak vesting. At unlock events, massive sell pressure overwhelms organic demand, crashing the price and destroying community trust.
- **Symptoms**: Token price drops sharply at every vesting unlock event; early investors visibly dumping on community buyers; community complains about "VC dump" on social media
- **Fix**: Cap team + investor allocation at 30% of total supply. Mandate minimum 1-year cliff and 3-year linear vest for team. Investor vesting should be at least 6-month cliff with 18-month linear vest. No immediate unlock at TGE for any insider category. Model the sell pressure at each unlock event and ensure it is absorbable by projected demand.

### 2. No Vesting or Cosmetic Vesting
- **Problem**: Token distribution documents show vesting schedules, but the tokens are not locked in on-chain vesting contracts. The team can sell at any time regardless of the published schedule. Alternatively, vesting contracts exist but have owner-override functions that can release all tokens instantly.
- **Symptoms**: Team wallets sell tokens before published vesting dates; "vesting" is tracked in a spreadsheet, not a smart contract; vesting contract has an `emergencyRelease()` function callable by owner
- **Fix**: Deploy audited on-chain vesting contracts with no owner override. Use established vesting protocols (Sablier, Hedgey, TokenVesting). Publish vesting contract addresses for community verification. Remove any emergency release functions — if tokens should be locked, they should be truly locked.

### 3. Infinite Emission Without Sink
- **Problem**: Tokens are continuously minted as rewards (staking, farming, play-to-earn) but there is no mechanism to remove tokens from circulation. Supply grows indefinitely while demand is finite, creating persistent downward price pressure.
- **Symptoms**: Continuously declining token price despite user growth; inflation rate exceeds protocol revenue growth; yield farming APR denominated in token drops as token price falls, creating a death spiral
- **Fix**: Design explicit token sinks: burn on usage, protocol fee buyback-and-burn, staking lockups that genuinely reduce circulating supply, governance locking (veTokenomics). Ensure sink rate can plausibly match or exceed emission rate within 12-18 months of launch.

### 4. Reflexive Token Mechanics
- **Problem**: Protocol mechanics where falling token price directly causes more token selling, creating a self-reinforcing death spiral. Classic example: algorithmic stablecoins where depegging triggers minting and selling of the governance token.
- **Symptoms**: Protocol requires token price to stay above a threshold to function; falling price triggers automated selling or minting; small price drops cascade into large crashes (LUNA/UST pattern)
- **Fix**: Ensure no protocol mechanism has token price as a direct input that triggers selling. Build resilience through overcollateralization and circuit breakers. Stress-test tokenomics under -50%, -70%, -90% price scenarios. If the protocol breaks under adverse price conditions, the design is reflexive and must be changed.

## Smart Contract Anti-Patterns

### 5. Unaudited Launch
- **Problem**: Deploying a token contract without a professional security audit. Even experienced developers miss vulnerabilities. The cost of an exploit (total loss of funds) far exceeds the cost of an audit ($5K-$50K for standard token contracts).
- **Symptoms**: Contract deployed with no audit report; using a fork of another token contract with modifications that were not reviewed; "we audited it ourselves" claim
- **Fix**: Get an audit from a recognized firm before mainnet deployment. At minimum, use an automated scanner (Slither, Mythril, Aderyn) and have the code reviewed by an independent developer. Publish the full audit report publicly. Address all critical and high findings before deployment.

### 6. Hidden Owner Backdoors
- **Problem**: Contract includes owner-only functions that enable rugpulling: unlimited minting, fee modification to 100%, trading pause with no resume mechanism, blacklisting arbitrary addresses, LP token withdrawal. These functions may be obfuscated or inherited from obscure base contracts.
- **Symptoms**: Contract has `mint()` callable by owner with no cap; `setFee()` with no maximum limit; `pause()` with no `unpause()` or community governance over pause; `withdrawTokens()` that can drain the contract
- **Fix**: Remove all unnecessary owner privileges. Hard-code maximum fee limits. If mint is needed, cap it and put it behind a timelock. Make pause functions governance-controlled or time-limited. Verify that all inherited contracts (parent classes) do not introduce hidden functions. Use Solidity's `override` keyword to explicitly document all function overrides.

### 7. Copy-Paste Contract with Minimal Changes
- **Problem**: Taking another project's verified contract, changing only the name, symbol, and supply, and deploying it. The original contract may have project-specific logic that is inappropriate, insecure in a different context, or contains hidden backdoors intentionally placed by the original developers.
- **Symptoms**: Contract bytecode is nearly identical to a known contract; inherited project-specific logic (fees going to the original project's address, references to external contracts); using a "token generator" website that produces cookie-cutter contracts
- **Fix**: Start from OpenZeppelin base contracts and add only the specific extensions needed. Understand every line of code in the contract. If using another project as a reference, rewrite the logic from scratch using the concept, not the code. Never deploy code you do not fully understand.

### 8. Immutable Tax to External Address
- **Problem**: Hard-coding a fee recipient address that receives a percentage of every transfer. If this address is compromised, all future fees go to the attacker. If the team wants to change the fee structure, it is impossible without deploying a new contract.
- **Symptoms**: Contract has a constant fee recipient address with no way to update it; fee percentage is hard-coded with no governance mechanism to adjust it
- **Fix**: Make the fee recipient configurable via a governance function with a timelock. Alternatively, send fees to a treasury contract that can be governed by token holders. Keep fee configuration flexible but with hard-coded maximum limits.

## Launch Execution Anti-Patterns

### 9. No Liquidity Lock
- **Problem**: Creating a DEX pool and holding the LP tokens in a team wallet without locking them. The team can remove all liquidity at any time, crashing the price to zero — the classic rugpull mechanism.
- **Symptoms**: LP tokens sitting in an EOA (externally owned account) rather than a lock contract; lock "proof" that links to an unverified contract; lock duration of less than 3 months
- **Fix**: Lock LP tokens in a reputable lock contract (Team Finance, Unicrypt, PinkLock) for at least 6 months, preferably 12+ months. Publish the lock transaction hash. Community should verify the lock on-chain — not trust screenshots or claims.

### 10. Bot-Blind Launch
- **Problem**: Adding liquidity to a DEX and enabling trading without any anti-bot measures. Professional sniper bots monitor pending pool creation transactions and buy in the same block (often the same transaction bundle), acquiring a large portion of supply at the initial price before any human can participate.
- **Symptoms**: First buy transactions are from contract addresses (bot contracts); first buyers hold 5-20% of supply within seconds; initial price spikes immediately then dumps as bots sell to retail
- **Fix**: Implement at least 2 anti-bot measures: (1) max transaction limit for the first 50-100 blocks, (2) max wallet limit for the first 24 hours. Consider using a Liquidity Bootstrapping Pool (LBP) for fairer price discovery. Alternatively, use a whitelist for the first minutes of trading.

### 11. Insufficient Initial Liquidity
- **Problem**: Launching with minimal liquidity ($1K-$5K) causing extreme price impact for any trade. This makes the token untradeable for most users and creates opportunities for manipulation with small capital.
- **Symptoms**: Single $100 buy causes >10% price movement; extreme volatility in first hours; wide effective bid-ask spread
- **Fix**: Launch with sufficient liquidity for the expected trading volume. Minimum: 5-10% of initial market cap as pool liquidity. For a $1M initial market cap, seed at least $50K-$100K in the pool. If capital is limited, use an LBP to bootstrap price discovery without requiring large upfront liquidity.

### 12. No Post-Launch Plan
- **Problem**: Team focuses entirely on the launch event and has no plan for the weeks and months after. Token price decays post-launch as there are no catalysts, partnerships, or development milestones to sustain interest.
- **Symptoms**: Radio silence after launch; no product roadmap; no community engagement post-TGE; volume drops to near zero within weeks
- **Fix**: Prepare a detailed 90-day post-launch roadmap BEFORE launch. Schedule regular community updates (weekly minimum). Plan at least 3 post-launch catalysts within the first 90 days (exchange listing, product feature, partnership announcement). Budget marketing spend for post-launch, not just pre-launch hype.
