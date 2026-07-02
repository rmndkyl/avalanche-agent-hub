# Avalanche Agent Hub — Fuji Testnet Deployment

**Date:** 2026-07-02
**Network:** Fuji Testnet (Chain ID 43113)
**Deployer:** 0xDEDB5f8746F50620CBc9d8b7aF5F331969CbD2A4

## Contract Addresses (v2 — Bug Fixes Applied)

| Contract | Address | Snowtrace |
|----------|---------|-----------|
| AgentRegistry | `0x58aaa6Af773E419D3334fD671EA87bCea1bEF90c` | [View](https://testnet.snowtrace.io/address/0x58aaa6Af773E419D3334fD671EA87bCea1bEF90c) |
| QuestFactory | `0x53ecd26D6D45fd19D5E0CE84E326124F55bf9DCA` | [View](https://testnet.snowtrace.io/address/0x53ecd26D6D45fd19D5E0CE84E326124F55bf9DCA) |

## Bug Fixes Applied (v2)

### Critical Fixes
1. **C-1: Quest Status Mutation** — Per-user completion tracking instead of global status
2. **C-2: Reward Escrow** — Added `fundQuest()` function for token deposits

### High Fixes
3. **H-1: Unbounded Loops** — Added MAX_TASKS (50) and MAX_TOKENS (100) caps
4. **H-2: Transaction Inflation** — Added MAX_TRANSACTION_COUNT (1000) bound
5. **H-3: Missing nonReentrant** — Added to `completeTask`

### Medium Fixes
6. **M-1: Access Control** — Agent owners can now pause/unpause their agents
7. **M-3: Duplicate Tokens** — Added duplicate check in token registration
8. **M-5: Empty Title** — Added title validation

## Previous Deployment (v1 — Deprecated)

| Contract | Address | Status |
|----------|---------|--------|
| AgentRegistry | `0x782729F1ae1fdfe23E6667790e43Fb55B0119C09` | Deprecated |
| QuestFactory | `0xF2F2Bf3614E25A4eB31b287c0272111350bf1cE9` | Deprecated |

## Verification

To verify contracts on Snowtrace:
```bash
npx hardhat verify --network fuji 0x58aaa6Af773E419D3334fD671EA87bCea1bEF90c
npx hardhat verify --network fuji 0x53ecd26D6D45fd19D5E0CE84E326124F55bf9DCA
```
