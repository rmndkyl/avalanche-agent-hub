# Contributing to Avalanche Agent Hub

## Development Setup

```bash
git clone https://github.com/rmndkyl/avalanche-agent-hub.git
cd avalanche-agent-hub
npm install
```

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run dev` | Watch mode for development |
| `npm test` | Run tests (Jest) |
| `npm run lint` | Lint `src/` (ESLint + TypeScript) |

## Code Style

- **TypeScript strict mode** — no `any`, no implicit `undefined`
- **Node >= 18** — use native APIs over polyfills
- **One class per module** — `QuestSDK`, `AgentKit`, `WalletManager`
- **Async/await** — no raw promises or callbacks
- **Exports**: named exports only. `index.ts` re-exports everything.

### Naming

- Files: `camelCase.ts`
- Classes: `PascalCase`
- Interfaces: `PascalCase` (no `I` prefix)
- Methods: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### Imports order

1. Node built-ins
2. External packages (`ethers`, `viem`, `@avalanche-sdk/client`)
3. Internal modules (`./types`, `./hub`)

## PR Process

1. Branch from `master`
2. Make changes with clear, single-purpose commits
3. Run `npm run lint && npm run build && npm test` — all must pass
4. Open PR against `master`
5. PR description: what changed, why, how to test
6. One approval required to merge

### Commit messages

```
feat: add quest verification for custom task types
fix: correct portfolio aggregation for multi-chain wallets
docs: update AgentKit security guidelines
refactor: extract encryption logic into shared utility
```

## Testing

- Tests live in `src/**/*.test.ts`
- Jest + ts-jest
- One assertion per test minimum
- Name tests: `it('should <expected behavior>')`

```typescript
// src/quest.test.ts
import { QuestSDK } from './quest';

describe('QuestSDK', () => {
  const sdk = new QuestSDK({ network: 'testnet' });

  it('should create a quest with active status', async () => {
    const quest = await sdk.create({
      title: 'Test',
      chain: 'avalanche',
      tasks: [],
      rewards: { token: 'AVAX', amount: 1, distribution: 'instant' },
    });
    expect(quest.status).toBe('active');
  });
});
```

### Coverage target

Aim for tests on all public methods. Skip tests for private helpers unless they contain non-trivial logic.

## Dependencies

Before adding a dependency:
1. Can stdlib do it? Use stdlib.
2. Is it already in `package.json`? Use it.
3. Is the bundle size reasonable for a `< 1MB` package?
4. Does it have TypeScript types?

Never add dependencies for < 10 lines of code you can write yourself.
