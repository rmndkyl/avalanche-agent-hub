# Agent Kit Guide

Deploy and manage autonomous AI agents on Avalanche.

## Agent Types

| Type | Purpose |
|------|---------|
| `trader` | Executes trades within defined rules (size, tokens, stop-loss) |
| `monitor` | Watches on-chain events, alerts on thresholds |
| `portfolio` | Rebalances positions, tracks multi-token holdings |
| `custom` | User-defined logic via `rules` metadata |

## Deploying an Agent

```typescript
const agent = await hub.agent.deploy({
  type: 'trader',
  wallet: '0x...',  // agent-controlled wallet address
  rules: {
    maxTradeSize: '100',           // max AVAX per trade
    allowedTokens: ['AVAX', 'USDC', 'JOE'],
    stopLoss: '5',                 // % loss trigger
    takeProfit: '10',              // % gain trigger
    maxDailyTransactions: 50,
  },
});
// agent.id → used for status/pause/stop
```

## Agent Rules

Rules constrain agent behavior. All fields are optional — omit to leave unconstrained.

```typescript
interface AgentRules {
  maxTradeSize?: string;          // max single trade value
  allowedTokens?: string[];       // whitelist of tokens
  stopLoss?: string;              // percentage
  takeProfit?: string;            // percentage
  maxDailyTransactions?: number;
  [key: string]: unknown;         // custom rules via metadata
}
```

### Custom rules

```typescript
rules: {
  maxTradeSize: '50',
  customStrategy: 'momentum',     // your app reads this
  minLiquidity: '1000000',        // skip low-liquidity pairs
}
```

## Monitoring Activity

```typescript
const status = await hub.agent.status(agentId);
// {
//   agent: { id, type, wallet, rules, status, createdAt },
//   metrics: { totalTransactions, totalVolume, lastActivity }
// }
```

## Lifecycle Management

```typescript
await hub.agent.pause(agentId);   // suspend without losing state
await hub.agent.stop(agentId);    // full stop
```

Status flow: `active` → `paused` → `active` (resume) or `stopped` (terminal).

## Listing Agents

```typescript
const traders = await hub.agent.listAgents({ type: 'trader' });
const active = await hub.agent.listAgents({ status: 'active' });
```

## Security Best Practices

1. **Least privilege wallets**: Fund agent wallets with only what they need. Never use primary wallets.
2. **Hard limits always**: Set `maxTradeSize` and `maxDailyTransactions`. An agent without limits is an unbounded liability.
3. **Stop-loss mandatory**: Always set `stopLoss`. No exceptions.
4. **Audit rules before deploy**: `pause()` → inspect → `stop()` if behavior is wrong.
5. **Separate wallets per agent**: Isolates risk. One compromised agent doesn't drain everything.
6. **Monitor continuously**: Poll `status()` in a loop or set up alerts on `lastActivity` gaps.
7. **Never store private keys in rules**: Rules are plaintext metadata. Keys belong in encrypted wallet storage only.
