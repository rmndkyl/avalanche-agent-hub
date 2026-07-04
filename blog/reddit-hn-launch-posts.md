# Reddit & Hacker News Launch Posts

## 1. Reddit r/Avalanche

**Title:** I built an open-source SDK for deploying AI agents and creating on-chain quests on Avalanche — feedback welcome

**Body:**

Hey r/Avalanche! 👋

I've been building crypto automation tools on Avalanche for 2 years. After rebuilding the same wallet management, quest verification, and reward distribution code for the 11th time, I decided to package it all into an open-source SDK.

**What is it?**

Avalanche Agent Hub (`agent-hub-avax` on npm) — a TypeScript SDK with 3 modules:

- **Quest SDK** — Create on-chain quests, verify completion, distribute rewards. Composable, on-chain, UUPS upgradeable.
- **Agent Kit** — Deploy AI agent templates (price monitor, portfolio manager, trader). Configurable, extensible.
- **Wallet Manager** — Multi-wallet management with AES-256-GCM encryption, key rotation, zero plaintext storage.

**What's already built:**
- ✅ npm package published (`agent-hub-avax@0.1.0`)
- ✅ Smart contracts deployed to Fuji testnet (verified on Sourcify)
- ✅ 88/88 tests passing
- ✅ Live dashboard with real Fuji RPC data
- ✅ Protocol-specific examples (Trader Joe swap quest, Benqi lending quest)
- ✅ Team1 Mini Grant submitted

**Why Avalanche specifically?**
- Sub-second finality, gas in cents
- KiteAI ecosystem ($33M funded, 715M+ agent calls)
- $2.77B TVL, institutional adoption (BlackRock, Visa)
- Subnet architecture for custom agent fleets

**Try it:**
```bash
npm install agent-hub-avax
```

```typescript
import { QuestSDK, AgentKit, WalletManager } from 'agent-hub-avax';
```

**GitHub:** https://github.com/agenthubavax/avalanche-agent-hub

Looking for feedback on:
1. What quest patterns would be most useful for your project?
2. What agent templates should we add next?
3. Any security concerns with the smart contract architecture?

---

## 2. Reddit r/typescript

**Title:** TypeScript SDK for AI agents on Avalanche — open-source, looking for feedback

**Body:**

Built a TypeScript SDK for deploying AI agents and managing on-chain quests on Avalanche.

**What's inside:**
- Quest SDK (on-chain quest creation + reward distribution)
- Agent Kit (template-based agent deployment)
- Wallet Manager (AES-256 encryption, multi-wallet)

**Tech stack:**
- TypeScript + ethers.js v6
- Solidity 0.8.24 (UUPS upgradeable contracts)
- Next.js dashboard
- 88 tests (Hardhat + Mocha)

```typescript
import { QuestSDK } from 'agent-hub-avax';

const sdk = new QuestSDK({ rpcUrl: '...', privateKey: '...' });

const quest = await sdk.createQuest({
  title: 'Deploy your first agent',
  rewardAmount: ethers.parseEther('10'),
  maxCompletions: 1000,
});
```

**npm:** https://www.npmjs.com/package/agent-hub-avax
**GitHub:** https://github.com/agenthubavax/avalanche-agent-hub

Would love feedback on:
- API design / DX improvements
- TypeScript types quality
- Missing features for a v0.1.0

---

## 3. Hacker News — Show HN

**Title:** Show HN: TypeScript SDK for AI Agents on Avalanche L1 Chains

**Body:**

We built an open-source TypeScript SDK for deploying AI agents and creating on-chain quests on Avalanche.

The problem: every team building agents on Avalanche reimplements the same infrastructure — wallet management, quest verification, reward distribution. We packaged 2 years of production experience into a reusable SDK.

Three modules:
1. Quest SDK — programmable on-chain quests with token rewards
2. Agent Kit — template-based agent deployment (monitor, trader, portfolio)
3. Wallet Manager — encrypted multi-wallet management

Smart contracts are deployed to Fuji testnet, verified on Sourcify, and backed by 88 tests. The dashboard shows live on-chain data.

npm install agent-hub-avax

GitHub: https://github.com/agenthubavax/avalanche-agent-hub

Built solo, open-source under MIT. Looking for feedback on architecture decisions and what to prioritize next.
