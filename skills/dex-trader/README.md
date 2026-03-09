# @lobster-u/dex-trader

> DEX trading strategy analysis, liquidity assessment, slippage optimization, and MEV-aware execution planning for OpenClaw Agent

## Installation

```bash
# via npm
npm install @lobster-u/dex-trader

# via clawhub
clawhub install @lobster-u/dex-trader
```

## Category

Crypto

## Capabilities

- Analyze AMM pool mechanics across Uniswap v2/v3, Curve, Balancer, PancakeSwap, Raydium, and Orca
- Calculate price impact and slippage for trades of various sizes
- Design MEV-aware execution strategies with sandwich attack mitigation
- Evaluate liquidity provision opportunities with impermanent loss modeling
- Route trades across DEXs and aggregators (1inch, Jupiter, CowSwap)
- Analyze token pair market microstructure and liquidity health

## Dependencies

None

## Files

| File | Description |
|------|-------------|
| `manifest.json` | Skill metadata and configuration |
| `SKILL.md` | Role definition and activation rules |
| `knowledge/` | Domain knowledge: AMM mechanics, slippage math, MEV, aggregators |
| `strategies/` | 6-step trading strategy from market analysis to risk monitoring |
| `tests/` | Smoke and benchmark tests (10 tasks across easy/medium/hard) |

## License

MIT
