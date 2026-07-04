# Partnership Outreach Templates

## 1. Trader Joe (DEX)

### Twitter DM Template

```
Hey Trader Joe team! 👋

I built an open-source SDK for creating on-chain quests on Avalanche — 
and I just added a Trader Joe swap quest example.

The idea: protocols use our QuestFactory contract to create reward 
campaigns. Users complete swaps on Trader Joe → get verified on-chain 
→ earn token rewards. All composable, all open-source.

Example flow:
- Protocol creates quest: "10 swaps on Trader Joe → earn 50 JOE"
- Users swap → verifier bot checks Router events
- Rewards distributed via pull pattern (secure, gas-efficient)

This could be useful for:
- New user onboarding campaigns
- Liquidity mining quests
- Cross-protocol DeFi challenges

Would love to explore how this could benefit the Trader Joe ecosystem.

GitHub: github.com/agenthubavax/avalanche-agent-hub
Example: examples/trader-joe-quest/

Happy to jump on a call or discuss here.
```

### Discord Message Template (Avalanche/Trader Joe Discord)

```
Hey everyone! 🔺

Just published a protocol example showing how Trader Joe could be 
integrated with our open-source quest SDK (Avalanche Agent Hub).

The concept: protocols create on-chain quests that reward users for 
completing DeFi actions — like swapping on Trader Joe.

→ Quest creation: 10 lines of code
→ Verification: on-chain event monitoring
→ Rewards: escrowed in smart contract, pull-based claims

Example: github.com/agenthubavax/avalanche-agent-hub/tree/main/examples/trader-joe-quest

Would love feedback from the Trader Joe community on what quest 
patterns would be most useful.
```

---

## 2. Benqi (Lending)

### Twitter DM Template

```
Hey Benqi team! 👋

I'm building Avalanche Agent Hub — an open-source SDK for on-chain 
quests and agent operations on Avalanche.

Just created a Benqi lending quest example that shows how your protocol 
could run user onboarding campaigns:

Quest: "Supply $100+ AVAX to Benqi → Earn 25 QI tokens"

Flow:
- Protocol creates quest via QuestFactory (on-chain)
- Verifier monitors Benqi Mint events
- Users get rewarded for providing liquidity

This could help with:
- New lender acquisition
- TVL growth campaigns
- Cross-protocol DeFi quests (supply on Benqi + swap on Trader Joe)

Would this be interesting for Benqi's ecosystem growth?

GitHub: github.com/agenthubavax/avalanche-agent-hub
```

---

## 3. KiteAI (AI Agent Ecosystem)

### Twitter DM Template

```
Hey KiteAI team! 👋

I'm building Avalanche Agent Hub — an open-source TypeScript SDK 
for deploying AI agents on Avalanche.

With 715M+ agent calls on your network, I think there's a natural 
synergy:

- KiteAI = the runtime for AI agents on Avalanche
- Agent Hub = the developer tooling layer

Integration ideas:
- Agent Hub templates that deploy agents into KiteAI's inference 
  marketplace
- Quest campaigns: "Deploy an agent on KiteAI → earn rewards"
- Shared wallet management for KiteAI agent operators

Would love to explore a technical integration.

GitHub: github.com/agenthubavax/avalanche-agent-hub
npm: agent-hub-avax@0.1.0
```

---

## 4. General Avalanche Ecosystem Team

### Template for any protocol

```
Hi [Protocol] team!

I'm building Avalanche Agent Hub — an open-source developer toolkit 
for on-chain quests and agent operations on Avalanche.

I just published a [Protocol]-specific quest example showing how your 
team could create reward campaigns in ~10 lines of code:

Quest: "[describe quest action] → earn [reward token]"

The SDK handles:
✅ On-chain quest creation (UUPS upgradeable contracts)
✅ Token escrow + pull-based reward distribution
✅ Verifier pattern for on-chain action verification
✅ Per-user completion tracking (anti-sybil)

This could power:
- User onboarding campaigns
- Liquidity/TVL growth incentives
- Cross-protocol DeFi challenges
- Community engagement quests

Would love to discuss how this could benefit [Protocol]'s ecosystem.

GitHub: github.com/agenthubavax/avalanche-agent-hub
Dashboard: dashboard-mauve-eight-44.vercel.app
```

---

## Outreach Priority

| Protocol | Channel | Priority | Reason |
|----------|---------|----------|--------|
| Trader Joe | Twitter DM + Discord | HIGH | Largest DEX, example already built |
| Benqi | Twitter DM | HIGH | Largest lending, example already built |
| KiteAI | Twitter DM | HIGH | AI agent synergy, $33M funded |
| Yield Yak | Twitter DM | MEDIUM | Yield aggregator, good quest target |
| Dexalot | Twitter DM | MEDIUM | 400M+ txns, orderbook DEX |
| Pangolin | Discord | LOW | Smaller DEX, community-driven |
