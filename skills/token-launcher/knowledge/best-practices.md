---
domain: token-launcher
topic: launch-security-and-tokenomics-quality
priority: high
ttl: 90d
---

# Token Launch — Best Practices

## Security-First Contract Design

### Use OpenZeppelin Base Contracts
- Always inherit from OpenZeppelin's audited implementations rather than writing token logic from scratch
- Standard base: `import "@openzeppelin/contracts/token/ERC20/ERC20.sol"`
- Common extensions stack: ERC20 + ERC20Burnable + ERC20Permit + Ownable2Step
- Avoid custom transfer logic unless absolutely necessary — every custom line is an attack surface
- If custom logic is required, keep it minimal and document the deviation from standard behavior

### Minimize Owner Privileges
The fewer things the owner can do, the more trust the community has in the token:

| Privilege Level | Owner Can Do | Community Trust |
|----------------|-------------|-----------------|
| **Fully Renounced** | Nothing — contract is immutable | Highest trust, zero flexibility |
| **Minimal** | Pause in emergency only | High trust, safety net |
| **Moderate** | Adjust fees within hard cap, manage blacklist | Medium trust, operational flexibility |
| **Extensive** | Mint tokens, change any parameter, upgrade contract | Low trust — requires strong governance |

Recommendation for new projects:
- Start with moderate privileges for operational needs during early phase
- Commit to a public renunciation schedule (e.g., renounce mint after initial distribution, renounce pause after 6 months)
- Use timelocks (24-48 hour delay) on all owner functions so the community can react

### Hard-Code Safety Limits
- Maximum fee: Hard-code the maximum possible transfer fee (e.g., `require(newFee <= 500, "Max 5%")`)
- Maximum supply: Use `ERC20Capped` with an immutable supply cap
- Fee recipient: Use an immutable fee address or restrict changes via timelock
- Blacklist limits: If blacklisting is needed, limit the total number of blacklisted addresses and require timelock for additions

### Compiler and Deployment
- Use Solidity >=0.8.0 for built-in overflow/underflow protection
- Enable optimizer with moderate runs (200-500) for gas efficiency without extreme bytecode complexity
- Deploy to testnet first (Sepolia for Ethereum, BSC Testnet for BSC) and test all functions
- Verify contract source code on the block explorer immediately after deployment
- Use deterministic deployment (CREATE2) for predictable contract addresses across chains

## Tokenomics Design Principles

### Supply Pressure Modeling
Before finalizing tokenomics, model the monthly sell pressure:
1. List all token unlock events for the first 24 months
2. For each unlock, estimate sell rate (20-40% for investors, 10-20% for team, 5-15% for community rewards)
3. Sum monthly expected sell volume
4. Compare against expected monthly buy demand (market growth, staking demand, utility consumption)
5. Ensure sell pressure never exceeds 2x the projected buy demand in any month — otherwise, the price will trend down regardless of fundamentals

### Incentive Alignment Checklist
- Team vesting is longer than investor vesting (team should be the last to exit)
- Community allocation is the largest single category (demonstrates community-first values)
- Treasury releases are governance-controlled, not team-controlled
- Staking rewards decrease over time to prevent infinite inflation dependency
- Token has genuine utility beyond speculation (governance, fee payment, access, collateral)

### Avoiding Death Spirals
- Do not make token price a direct input to protocol mechanics (reflexive loops)
- Do not rely solely on new token buyers to fund rewards for existing holders (Ponzi dynamics)
- Do not create mechanisms where falling price triggers more selling (e.g., algorithmic stablecoin depegging, forced liquidation of staked tokens)
- Build revenue-based sustainability: protocol earns fees independent of token price, fees support token value through buyback or staker distribution

### Anti-Dump Mechanisms (Use Judiciously)
- **Sell tax**: 1-5% tax on sells, distributed to holders or treasury. Higher taxes reduce liquidity and deter legitimate trading.
- **Sell cooldown**: Minimum holding period before selling. Controversial and limits composability with DeFi.
- **Gradual selling limits**: Cap daily sell amounts per wallet. Complex to implement correctly and easy to circumvent with multiple wallets.
- **Recommendation**: Rely on proper vesting and organic utility rather than aggressive anti-dump mechanics. Anti-dump features signal distrust of your own tokenomics.

## Launch Execution

### Pre-Launch Checklist
1. **Contract deployed and verified** on block explorer
2. **Audit completed** by a recognized firm (CertiK, Trail of Bits, OpenZeppelin, Peckshield)
3. **Liquidity prepared**: Base tokens (ETH/BNB/USDC) ready for pool creation
4. **LP lock contract** deployed and tested
5. **Anti-bot measures** configured and tested on testnet
6. **Token approvals**: Contract approved on DEX router for LP creation
7. **Team wallets**: Vesting contracts deployed and funded
8. **Investor wallets**: Vesting contracts deployed and funded with correct cliff/schedule
9. **Community**: Announcement published with contract address, liquidity lock proof, and audit report
10. **Monitoring**: Set up alerts for large transfers, LP removals, and unusual activity

### Launch Day Execution Order
1. Deploy token contract (if not already deployed)
2. Verify contract source code on explorer
3. Transfer tokens to vesting contracts (team, investors)
4. Approve DEX router for token spending
5. Create DEX pool and add initial liquidity
6. Lock LP tokens through lock contract
7. Publish lock transaction hash as proof
8. Enable trading (if using a trading-enable switch)
9. Monitor first 100 blocks for bot activity
10. Verify price and liquidity match expected parameters

### Post-Launch Monitoring
- **First 24 hours**: Monitor every large transaction (>1% of supply), check for sniper activity, verify anti-bot measures worked
- **First week**: Track holder distribution, volume patterns, LP stability, fee accrual
- **First month**: Monitor vesting unlock events, treasury usage, governance activity, organic volume growth
- **Ongoing**: Monthly holder distribution analysis, liquidity depth tracking, sell pressure vs. demand modeling

## Regulatory Awareness

### Securities Law Considerations
- **Howey Test (US)**: A token may be a security if there is: (1) investment of money, (2) in a common enterprise, (3) with expectation of profit, (4) derived from the efforts of others
- Utility tokens with genuine use cases have stronger arguments for non-security status
- Governance tokens that grant control over protocol parameters can argue for sufficiently decentralized governance
- Do NOT make promises about token price appreciation in any materials — this is the single strongest indicator of a security

### Risk Mitigation
- Consult legal counsel before any token sale or public distribution in the US, EU, or UK
- Consider geo-blocking restricted jurisdictions from presale participation
- Structure team compensation as grants with service conditions, not investment returns
- Ensure the token has functional utility at or before launch — not just speculative value
- Maintain clear records of token distribution, vesting, and treasury management for potential regulatory review

### Compliance Signals
- Published legal opinion from a reputable law firm
- Clear terms of service for token holders
- KYC/AML for presale participants (for larger raises)
- Transparent treasury management with regular public reports
- Decentralized governance with on-chain voting for treasury disbursements
