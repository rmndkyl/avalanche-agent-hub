# ADR-001: Avalanche Agent Hub — System Architecture

**Status**: Proposed  
**Date**: 2026-07-02  
**Deciders**: rmndkyl, Software Architect  

---

## Context

The Avalanche ecosystem has 550+ projects and a $33M-funded agent economy (KiteAI), but no open-source toolkit for deploying AI agents, managing multi-wallet operations, or creating on-chain quests on Avalanche C-Chain. Existing quest platforms (Galxe, Layer3, Zealy) are not Avalanche-native and offer no developer SDK.

**Current state**: Scaffold in `avalanche-agent-hub` with 5 stub files (`hub.ts`, `quest.ts`, `agent.ts`, `wallet.ts`, `types.ts`) — all TODO. Single flat npm package `@agent-hub/core`.

**Goal**: Modular TypeScript SDK that users can install piecemeal (`@agent-hub/quest`, `@agent-hub/agent`, `@agent-hub/wallet`), with on-chain contracts on C-Chain and a Next.js dashboard.

---

## Decision 1: Monorepo with npm Workspaces (not Turborepo/Lerna)

**Decision**: Use npm workspaces. 4 packages in one repo.

**Options considered**:
| Option | Pros | Cons |
|--------|------|------|
| **npm workspaces** (chosen) | Built-in, zero deps, simple | No caching/task orchestration |
| Turborepo | Build caching, task pipelines | Extra dep, complexity for 4 pkgs |
| Lerna | Legacy, battle-tested | Abandoned → Nx rebrand, heavy |
| Separate repos | Full independence | Dependency hell, no shared types |

**Trade-off**: Giving up build caching (irrelevant for <100 source files). Gaining zero-config workspace linking and single `npm install`.

**Rationale**: 4 packages don't justify Turborepo's overhead. npm workspaces handles `packages/*` linking natively. Can migrate to Turborepo later if build times grow.

---

## Decision 2: Module Boundaries — 3 Domain Packages + 1 Core

**Decision**: Split into 4 npm packages sharing a common `@agent-hub/types` package.

```
@agent-hub/core       → Facade, re-exports everything
@agent-hub/quest      → Quest creation, verification, on-chain tasks
@agent-hub/agent      → Agent deployment, templates, monitoring
@agent-hub/wallet     → Multi-wallet import, AES-256 encryption, portfolio
@agent-hub/types      → Shared interfaces (no runtime deps)
```

**Dependency graph**:
```
@agent-hub/core
  ├── @agent-hub/quest
  ├── @agent-hub/agent
  └── @agent-hub/wallet

@agent-hub/quest
  ├── @agent-hub/types
  └── viem (read-only chain ops)

@agent-hub/agent
  ├── @agent-hub/types
  ├── @agent-hub/wallet (needs wallet for agent deploy)
  └── viem (tx execution)

@agent-hub/wallet
  ├── @agent-hub/types
  └── viem (balance queries, key management)

@agent-hub/types
  └── (zero runtime deps — pure TS interfaces)
```

**Trade-off**: Agent-kit depends on wallet-manager (agents need wallets). This creates a coupling. Alternative: pass wallet as opaque string. But agents must sign txs → need real wallet access. Accepting the dependency.

**Reversibility**: High. Packages can be decoupled later by injecting wallet via config.

---

## Decision 3: Smart Contract Architecture

### QuestFactory.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract QuestFactory is AccessControl, ReentrancyGuard {
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");

    enum TaskType { OnChain, Social, Custom }
    enum QuestStatus { Active, Paused, Completed, Expired }

    struct Task {
        TaskType taskType;
        address verifier;       // verifier contract (0x0 for social/manual)
        bytes32 actionHash;     // keccak256 of action descriptor
        uint256 requiredCount;  // e.g., "do 5 swaps"
    }

    struct Reward {
        address token;          // ERC20 or 0x0 for AVAX
        uint256 amount;
        enum Distribution { Instant, Merkle, Claim }
        Distribution distribution;
    }

    struct Quest {
        uint256 id;
        address creator;
        string metadataURI;     // IPFS/Arweave URI for title, desc, image
        Task[] tasks;
        Reward reward;
        QuestStatus status;
        uint256 createdAt;
        uint256 expiresAt;
    }

    struct Completion {
        bool completed;
        uint256[] taskProgress; // per-task count
        bool claimed;
    }

    // Storage
    uint256 private _nextQuestId;
    mapping(uint256 => Quest) public quests;
    mapping(uint256 => mapping(address => Completion)) public completions;
    mapping(uint256 => address[]) public questParticipants;

    // Events
    event QuestCreated(uint256 indexed questId, address indexed creator, string metadataURI);
    event QuestUpdated(uint256 indexed questId, QuestStatus status);
    event TaskVerified(uint256 indexed questId, address indexed user, uint256 taskIndex, uint256 count);
    event RewardClaimed(uint256 indexed questId, address indexed user, uint256 amount);

    function createQuest(
        string calldata metadataURI,
        Task[] calldata tasks,
        Reward calldata reward,
        uint256 expiresAt
    ) external returns (uint256 questId);

    function verifyTask(
        uint256 questId,
        address user,
        uint256 taskIndex,
        uint256 count
    ) external onlyRole(CREATOR_ROLE);

    function claimReward(uint256 questId) external nonReentrant;

    function getQuest(uint256 questId) external view returns (Quest memory);
    function getCompletion(uint256 questId, address user) external view returns (Completion memory);
    function getActiveQuests(uint256 offset, uint256 limit) external view returns (uint256[] memory);
}
```

### AgentRegistry.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AgentRegistry is Ownable, ReentrancyGuard {
    enum AgentType { Trader, Monitor, Portfolio, Custom }
    enum AgentStatus { Active, Paused, Stopped, Slashed }

    struct Agent {
        uint256 id;
        address owner;
        address wallet;         // agent's signing wallet
        AgentType agentType;
        AgentStatus status;
        string configURI;       // IPFS URI for rules config
        uint256 createdAt;
        uint256 lastActivity;
        uint256 totalTransactions;
        uint256 slashedAmount;  // penalties for rule violations
    }

    // Storage
    uint256 private _nextAgentId;
    mapping(uint256 => Agent) public agents;
    mapping(address => uint256[]) public ownerAgents; // owner → agent IDs
    mapping(uint256 => bytes32) public agentConfigHash; // integrity check

    // Events
    event AgentRegistered(uint256 indexed agentId, address indexed owner, AgentType agentType);
    event AgentStatusChanged(uint256 indexed agentId, AgentStatus status);
    activity Recorded(uint256 indexed agentId, uint256 txCount);
    event AgentSlashed(uint256 indexed agentId, uint256 amount, string reason);

    function registerAgent(
        address wallet,
        AgentType agentType,
        string calldata configURI,
        bytes32 configHash
    ) external returns (uint256 agentId);

    function setAgentStatus(uint256 agentId, AgentStatus status) external;
    function recordActivity(uint256 agentId, uint256 txCount) external;
    function slashAgent(uint256 agentId, uint256 amount, string calldata reason) external onlyOwner;

    function getAgent(uint256 agentId) external view returns (Agent memory);
    function getAgentsByOwner(address owner) external view returns (uint256[] memory);
    function getActiveAgents(uint256 offset, uint256 limit) external view returns (uint256[] memory);
}
```

### TaskVerifier.sol (pluggable verifier)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Interface for pluggable quest task verifiers
interface ITaskVerifier {
    /// @notice Verify that a user completed a task
    /// @param user The user address
    /// @param actionHash The action descriptor hash
    /// @param requiredCount Minimum required completions
    /// @return actualCount Actual completions found
    /// @return verified Whether requirement is met
    function verify(
        address user,
        bytes32 actionHash,
        uint256 requiredCount
    ) external view returns (uint256 actualCount, bool verified);
}
```

**Trade-off**: Storing metadata off-chain (IPFS URI) vs on-chain. IPFS chosen — on-chain strings are expensive and quest metadata (images, descriptions) don't belong in contract storage. The `configHash` in AgentRegistry ensures integrity.

**Reversibility**: Medium. Contract interfaces are hard to change post-deployment. Using AccessControl/Ownable for upgrade paths (proxy pattern if needed later).

---

## Decision 4: Folder Structure

```
avalanche-agent-hub/
├── packages/
│   ├── types/                          # @agent-hub/types
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── quest.ts               # Quest, QuestTask, QuestReward
│   │   │   ├── agent.ts               # Agent, AgentRules, AgentType
│   │   │   ├── wallet.ts              # Wallet, Portfolio, EncryptedWallet
│   │   │   ├── config.ts              # HubConfig, NetworkConfig
│   │   │   └── events.ts              # SDK event types
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── quest/                          # @agent-hub/quest
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── quest-sdk.ts           # QuestSDK class
│   │   │   ├── verifiers/             # Pluggable task verifiers
│   │   │   │   ├── index.ts
│   │   │   │   ├── on-chain.ts        # OnChainVerifier (event log scanning)
│   │   │   │   ├── social.ts          # SocialVerifier (API calls)
│   │   │   │   └── custom.ts          # CustomVerifier (user-provided)
│   │   │   ├── contracts/             # Solidity + ABI
│   │   │   │   ├── QuestFactory.sol
│   │   │   │   ├── ITaskVerifier.sol
│   │   │   │   └── abi/               # Compiled ABIs
│   │   │   └── utils.ts               # IPFS upload, event parsing
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── agent/                          # @agent-hub/agent
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── agent-kit.ts           # AgentKit class
│   │   │   ├── templates/             # Agent templates
│   │   │   │   ├── index.ts
│   │   │   │   ├── trader.ts          # Trading agent logic
│   │   │   │   ├── monitor.ts         # Monitoring agent logic
│   │   │   │   └── portfolio.ts       # Portfolio agent logic
│   │   │   ├── contracts/
│   │   │   │   ├── AgentRegistry.sol
│   │   │   │   └── abi/
│   │   │   └── executor.ts            # Transaction execution engine
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── wallet/                         # @agent-hub/wallet
│       ├── src/
│       │   ├── index.ts
│       │   ├── wallet-manager.ts      # WalletManager class
│       │   ├── encryption.ts          # AES-256-GCM encrypt/decrypt
│       │   ├── portfolio.ts           # Multi-wallet balance aggregation
│       │   ├── importers/             # File format parsers
│       │   │   ├── index.ts
│       │   │   ├── json.ts            # JSON keystore import
│       │   │   ├── csv.ts             # CSV address list import
│       │   │   └── private-key.ts     # Raw private key import
│       │   └── utils.ts
│       ├── package.json
│       └── tsconfig.json
│
├── contracts/                          # Shared Solidity (deploy once)
│   ├── contracts/
│   │   ├── QuestFactory.sol
│   │   ├── AgentRegistry.sol
│   │   ├── TaskVerifier.sol
│   │   └── mocks/                     # Test mocks
│   ├── hardhat.config.ts
│   ├── deploy/
│   │   ├── 001_quest_factory.ts
│   │   └── 002_agent_registry.ts
│   └── test/
│       ├── quest-factory.test.ts
│       └── agent-registry.test.ts
│
├── dashboard/                          # Next.js dashboard (separate deploy)
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   ├── package.json
│   └── next.config.js
│
├── package.json                        # Root workspace config
├── tsconfig.base.json                  # Shared TS config
├── README.md
├── ARCHITECTURE.md                     # This file
└── LICENSE
```

---

## Decision 5: Encryption — AES-256-GCM (not AES-256-CBC)

**Decision**: AES-256-GCM for wallet encryption via Node.js `crypto` module.

**Options**:
| Algorithm | Pros | Cons |
|-----------|------|------|
| **AES-256-GCM** (chosen) | Authenticated encryption, tamper-proof | Slightly more complex |
| AES-256-CBC | Simple, widely understood | No authentication, vulnerable to padding oracle |
| Web Crypto API | Browser-compatible | Node.js `crypto` is faster, more control |

**Implementation**:
```typescript
// packages/wallet/src/encryption.ts
import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'crypto';

const ALGO = 'aes-256-gcm';
const SALT_LEN = 16;
const IV_LEN = 12;
const TAG_LEN = 16;
const KEY_LEN = 32;
const SCRYPT_N = 2 ** 17; // ~128ms on modern CPU — slow enough to resist brute force

export function encrypt(plaintext: Buffer, password: string): Buffer {
  const salt = randomBytes(SALT_LEN);
  const key = scryptSync(password, salt, KEY_LEN, { N: SCRYPT_N, r: 8, p: 1 });
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([salt, iv, tag, encrypted]);
}

export function decrypt(data: Buffer, password: string): Buffer {
  const salt = data.subarray(0, SALT_LEN);
  const iv = data.subarray(SALT_LEN, SALT_LEN + IV_LEN);
  const tag = data.subarray(SALT_LEN + IV_LEN, SALT_LEN + IV_LEN + TAG_LEN);
  const encrypted = data.subarray(SALT_LEN + IV_LEN + TAG_LEN);
  const key = scryptSync(password, salt, KEY_LEN, { N: SCRYPT_N, r: 8, p: 1 });
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}
```

**Trade-off**: scrypt N=2^17 is ~128ms per derivation. Could use N=2^20 for stronger (500ms), but that slows batch imports of 100+ wallets. Opting for practical speed.

---

## Decision 6: On-Chain State vs Local State

**Decision**: Hybrid — critical state on-chain, operational state local.

| Data | Where | Why |
|------|-------|-----|
| Quest definitions | On-chain (QuestFactory) | Trustless, verifiable |
| Quest completions | On-chain (QuestFactory) | Prevents fraud |
| Agent registrations | On-chain (AgentRegistry) | Public accountability |
| Agent activity logs | On-chain (AgentRegistry) | Audit trail |
| Agent rules/config | Off-chain (IPFS + local cache) | Gas cost prohibitive for frequent updates |
| Wallet private keys | Off-chain only (encrypted local) | NEVER on-chain |
| Portfolio balances | Off-chain (RPC queries) | Read-heavy, no need for storage |
| Quest metadata | Off-chain (IPFS URI in contract) | Images, descriptions too large |

**Trade-off**: Off-chain agent configs can drift from on-chain hash. Mitigated by `configHash` in AgentRegistry — SDK verifies hash before executing. If mismatch → agent pauses.

---

## Decision 7: Contract Interaction — viem (not ethers.js)

**Decision**: Use viem as the primary chain interaction library. Remove ethers.js dependency.

**Current state**: Both `ethers` and `viem` in `package.json`. This is dead weight.

**Why viem**:
- Avalanche SDK is already viem-compatible
- Tree-shakeable (smaller bundles)
- TypeScript-first with full type inference
- Better EIP-4844 / blob support for future use

**Trade-off**: ethers.js has larger community. But Avalanche ecosystem standardizes on viem. Mixing both creates confusion.

**Action**: Remove `ethers` from dependencies. Use `viem` + `@avalanche-sdk/client`.

---

## Decision 8: Dashboard — Next.js (separate from SDK)

**Decision**: Dashboard is a separate app, not bundled with the SDK.

**Rationale**:
- SDK is a library (npm package). Dashboard is an app (deployed independently).
- Users who only need the SDK shouldn't pull in Next.js/React.
- Dashboard can evolve independently (different release cycle).

**Stack**: Next.js 14 (App Router) + Tailwind + wagmi/viem for wallet connection.

---

## Decision 9: Verification Strategy — Pluggable Verifiers

**Decision**: Quest task verification uses a pluggable verifier pattern, not a monolithic checker.

```
QuestSDK.verify(taskId, wallet)
  → dispatches to TaskVerifier based on task.type
    → OnChainVerifier: scans event logs via viem
    → SocialVerifier: calls external APIs (Twitter, Discord)
    → CustomVerifier: user-provided callback function
```

**Trade-off**: Pluggability adds indirection. But quest tasks are inherently diverse (on-chain txs, social follows, form submissions). A monolithic verifier would become a god-class.

---

## Decision 10: Error Handling — Typed SDK Errors

**Decision**: Define domain-specific error classes, not generic `Error`.

```typescript
// @agent-hub/types
export class QuestError extends Error {
  constructor(
    message: string,
    public code: 'QUEST_NOT_FOUND' | 'QUEST_EXPIRED' | 'VERIFICATION_FAILED' | 'ALREADY_CLAIMED',
    public questId?: string,
  ) { super(message); this.name = 'QuestError'; }
}

export class AgentError extends Error {
  constructor(
    message: string,
    public code: 'AGENT_NOT_FOUND' | 'RULE_VIOLATION' | 'WALLET_LOCKED' | 'SLASHED',
    public agentId?: string,
  ) { super(message); this.name = 'AgentError'; }
}

export class WalletError extends Error {
  constructor(
    message: string,
    public code: 'DECRYPTION_FAILED' | 'INVALID_KEY' | 'BALANCE_INSUFFICIENT' | 'IMPORT_FAILED',
    public address?: string,
  ) { super(message); this.name = 'WalletError'; }
}
```

**Trade-off**: Custom errors are verbose. But SDK consumers need to catch specific failure modes (e.g., "quest expired" vs "verification failed" → different user actions).

---

## Decision 11: Testing Strategy

**Decision**: Unit tests (vitest) + integration tests (Hardhat fork) + no E2E framework.

| Layer | Tool | Coverage |
|-------|------|----------|
| Unit | vitest | SDK logic, encryption, verifiers |
| Contract | Hardhat + chai | Solidity tests on forked C-Chain |
| Integration | vitest + local fork | SDK ↔ contract interaction |

**Trade-off**: No Playwright/Cypress for dashboard (not an SDK concern). Dashboard testing deferred to dashboard sprint.

---

## Decision 12: Publishing — Single Entry Point with Tree-Shaking

**Decision**: `@agent-hub/core` is the main entry point. Sub-packages importable directly.

```typescript
// Users can do either:
import { AgentHub } from '@agent-hub/core';          // everything
import { QuestSDK } from '@agent-hub/quest';          // just quests
import { WalletManager } from '@agent-hub/wallet';    // just wallets
```

**package.json exports map**:
```json
{
  "name": "@agent-hub/core",
  "exports": {
    ".": "./dist/index.js",
    "./quest": "./packages/quest/dist/index.js",
    "./agent": "./packages/agent/dist/index.js",
    "./wallet": "./packages/wallet/dist/index.js",
    "./types": "./packages/types/dist/index.js"
  }
}
```

**Trade-off**: Sub-path exports add complexity but are required for the modular install story. Without them, tree-shaking can't eliminate unused modules reliably.

---

## Summary of Key Decisions

| # | Decision | Choice | Reversibility |
|---|----------|--------|---------------|
| 1 | Monorepo | npm workspaces | High |
| 2 | Module split | 4 packages (types, quest, agent, wallet) | High |
| 3 | Smart contracts | QuestFactory + AgentRegistry + ITaskVerifier | Low (on-chain) |
| 4 | Folder structure | `packages/` workspace layout | High |
| 5 | Encryption | AES-256-GCM + scrypt | Medium |
| 6 | State split | On-chain (trust) + off-chain (ops) | Medium |
| 7 | Chain lib | viem only (drop ethers) | High |
| 8 | Dashboard | Separate Next.js app | High |
| 9 | Verification | Pluggable verifier pattern | Medium |
| 10 | Errors | Typed domain error classes | High |
| 11 | Testing | vitest + Hardhat fork | High |
| 12 | Publishing | Sub-path exports in core package | Medium |

---

## Migration Path from Current Scaffold

Current: 5 flat files in `src/`  
Target: `packages/` monorepo

**Steps**:
1. Create `packages/types/src/` — move interfaces from `src/types.ts`
2. Create `packages/quest/src/` — move `src/quest.ts`, add verifiers + contracts
3. Create `packages/agent/src/` — move `src/agent.ts`, add templates
4. Create `packages/wallet/src/` — move `src/wallet.ts`, add encryption + importers
5. Create `packages/core/src/` — move `src/hub.ts` + `src/index.ts`
6. Update root `package.json` with `workspaces`
7. Remove `ethers` from dependencies
8. Add `contracts/` directory with Solidity
9. Add `dashboard/` directory with Next.js scaffold
10. Update `tsconfig.base.json` for shared compiler options
