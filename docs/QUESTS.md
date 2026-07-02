# Quest SDK Guide

Create, verify, and reward on-chain quests on Avalanche.

## Creating Quests

```typescript
import { QuestSDK } from '@agent-hub/core';

const quest = await hub.quest.create({
  title: 'Liquidity Provider Onboarding',
  chain: 'avalanche',
  tasks: [
    { type: 'on-chain', method: 'addLiquidity', contract: '0x...', count: 1 },
    { type: 'on-chain', method: 'stake', contract: '0x...', count: 3 },
    { type: 'social', platform: 'twitter', action: 'retweet' },
    { type: 'custom', metadata: { endpoint: '/api/verify-badge', method: 'POST' } },
  ],
  rewards: { token: 'AVAX', amount: 50, distribution: 'merkle' },
});
```

## Task Types

| Type | Use case | Key fields |
|------|----------|------------|
| `on-chain` | Contract interactions (swaps, mints, stakes) | `contract`, `method`, `count` |
| `social` | Twitter/Discord/Telegram actions | `platform`, `action` |
| `custom` | Arbitrary verification | `metadata` |

All types support optional `metadata: Record<string, unknown>` for extensibility.

## Verifying Completion

```typescript
const { completed, progress } = await hub.quest.verify({
  questId: quest.id,
  wallet: '0x...',
});
```

- `progress` — 0 to 100 (percentage of tasks done)
- `completed` — `true` when all tasks verified

## Reward Distribution

| Pattern | When to use |
|---------|-------------|
| `instant` | Auto-distribute on verification. Simple airdrops. |
| `merkle` | Merkle tree claim. Low gas, batch-friendly. |
| `claim` | User-initiated claim. For gated/delayed rewards. |

### Merkle distribution flow

1. Complete all tasks → `verify()` returns `completed: true`
2. Build merkle tree from verified wallets
3. Distribute: users claim via leaf proof

### Claim distribution flow

1. Quest completes → creator deploys claim contract
2. Users call claim with their proof
3. Contract validates and sends tokens

## Anti-Sybil Considerations

- **Wallet uniqueness**: Track verified wallets per quest. Reject duplicates.
- **On-chain history**: Require minimum transaction count or age before quest eligibility.
- **Rate limits**: Set `maxDailyTransactions` on linked agents to prevent farming.
- **Social verification**: Cross-reference social handles with on-chain identities.
- **Custom metadata**: Add KYC or proof-of-humanity checks via `custom` task type.

```typescript
// Example: adding a sybil-check task
tasks: [
  { type: 'custom', metadata: { type: 'sybil-check', minAccountAge: 30 } },
  { type: 'on-chain', method: 'swap', count: 1 },
]
```

## Listing & Filtering

```typescript
const activeQuests = await hub.quest.listQuests({ status: 'active' });
const avalancheQuests = await hub.quest.listQuests({ chain: 'avalanche' });
const quest = await hub.quest.getQuest(quest.id);
```
