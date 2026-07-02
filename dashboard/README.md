# Avalanche Agent Hub Dashboard

Next.js dashboard for Avalanche Agent Hub.

## What it shows
- Live Fuji RPC status
- Current block number
- Current gas price
- Deployer balance
- On-chain presence of `AgentRegistry` and `QuestFactory`
- Snowtrace links for both contracts

## Run locally
```bash
npm run dev
```

Open http://localhost:3000

## Data source
Dashboard reads live chain data from:
- `https://api.avax-test.network/ext/bc/C/rpc`

Deployment metadata lives in:
- `src/lib/avalanche.ts`

## Current contracts
- AgentRegistry: `0x58aaa6Af773E419D3334fD671EA87bCea1bEF90c`
- QuestFactory: `0x53ecd26D6D45fd19D5E0CE84E326124F55bf9DCA`

ponytail: no ABI reads yet, only RPC + bytecode existence. Add contract method reads when public view schema is finalized.
