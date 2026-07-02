# @agent-hub/core — Developer Guide

Open-source toolkit for AI agents and multi-wallet operations on Avalanche.

## Quick Start

```bash
npm install @agent-hub/core
```

```typescript
import { AgentHub } from '@agent-hub/core';

const hub = AgentHub.create({
  network: 'mainnet',       // 'mainnet' | 'testnet'
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',  // optional
  apiKey: 'your-api-key',   // optional
});

// Access modules directly
hub.quest   // QuestSDK
hub.agent   // AgentKit
hub.wallet  // WalletManager
```

## API Reference

### `AgentHub`

Entry point. Instantiates all three modules.

```typescript
AgentHub.create(config: HubConfig): AgentHub
hub.getConfig(): HubConfig
```

### `QuestSDK` — `hub.quest`

| Method | Returns |
|--------|---------|
| `create({ title, chain, tasks, rewards })` | `Promise<Quest>` |
| `verify({ questId, wallet })` | `Promise<{ completed: boolean; progress: number }>` |
| `getQuest(questId)` | `Promise<Quest \| null>` |
| `listQuests({ status?, chain? })` | `Promise<Quest[]>` |

### `AgentKit` — `hub.agent`

| Method | Returns |
|--------|---------|
| `deploy({ type, wallet, rules })` | `Promise<Agent>` |
| `status(agentId)` | `Promise<{ agent, metrics } \| null>` |
| `pause(agentId)` | `Promise<boolean>` |
| `stop(agentId)` | `Promise<boolean>` |
| `listAgents({ type?, status? })` | `Promise<Agent[]>` |

### `WalletManager` — `hub.wallet`

| Method | Returns |
|--------|---------|
| `import({ file, encryption?, password? })` | `Promise<Wallet[]>` |
| `portfolio(wallets)` | `Promise<Portfolio>` |
| `getBalance(address)` | `Promise<{ native, tokens }>` |
| `encrypt(wallet, password)` | `Promise<string>` |
| `decrypt(encrypted, password)` | `Promise<Wallet>` |

## Configuration

```typescript
interface HubConfig {
  network: 'mainnet' | 'testnet';
  rpcUrl?: string;   // defaults to Avalanche public RPC
  apiKey?: string;   // optional rate-limit bypass
}
```

## Common Patterns

### Import wallets, deploy a trader agent

```typescript
const wallets = await hub.wallet.import({
  file: './wallets.json',
  encryption: 'AES-256',
  password: process.env.WALLET_PASSWORD,
});

const agent = await hub.agent.deploy({
  type: 'trader',
  wallet: wallets[0].address,
  rules: {
    maxTradeSize: '100',
    allowedTokens: ['AVAX', 'USDC'],
    stopLoss: '5',
    takeProfit: '10',
    maxDailyTransactions: 50,
  },
});
```

### Create a quest and verify completion

```typescript
const quest = await hub.quest.create({
  title: 'First Swap Quest',
  chain: 'avalanche',
  tasks: [
    { type: 'on-chain', method: 'swap', count: 1 },
    { type: 'social', platform: 'twitter', action: 'follow' },
  ],
  rewards: { token: 'AVAX', amount: 10, distribution: 'instant' },
});

const result = await hub.quest.verify({ questId: quest.id, wallet: '0x...' });
// { completed: true, progress: 100 }
```

## Requirements

- Node.js >= 18
- Dependencies: `@avalanche-sdk/client`, `ethers` v6, `viem` v2
