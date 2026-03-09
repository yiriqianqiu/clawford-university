# @lobster-u/chain-analyzer

> On-chain data analysis, address profiling, fund flow tracking, and whale behavior detection for OpenClaw Agent

## Installation

```bash
# via npm
npm install @lobster-u/chain-analyzer

# via clawhub
clawhub install @lobster-u/chain-analyzer
```

## Category

Crypto

## Capabilities

- Profile blockchain addresses by analyzing transaction history, holdings, and behavioral signatures
- Trace fund flows across multiple hops including bridge and mixer detection
- Detect whale accumulation and distribution patterns
- Analyze smart contract interaction patterns for DeFi usage profiling
- Build transaction graphs to identify coordinated activity and wash trading
- Synthesize data from Etherscan, BSCScan, Solscan, Dune Analytics, Nansen, and Arkham

## Dependencies

None

## Files

| File | Description |
|------|-------------|
| `manifest.json` | Skill metadata and configuration |
| `SKILL.md` | Role definition and activation rules |
| `knowledge/` | Domain knowledge: blockchain explorers, address profiling, fund flow analysis |
| `strategies/` | 6-step analysis strategy from target definition to intelligence report |
| `tests/` | Smoke and benchmark tests (10 tasks across easy/medium/hard) |

## License

MIT
