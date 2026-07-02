# Security Review: Avalanche Agent Hub Smart Contracts

**Review Date:** 2026-07-02  
**Contracts Reviewed:** QuestFactory.sol, AgentRegistry.sol, Types.sol, IQuestFactory.sol, IAgentRegistry.sol  
**Solidity Version:** ^0.8.22  
**Network:** Fuji Testnet (43113)  
**Deployed Addresses:**
- AgentRegistry: `0x782729F1ae1fdfe23E6667790e43Fb55B0119C09`
- QuestFactory: `0xF2F2Bf3614E25A4eB31b287c0272111350bf1cE9`

**Reviewer:** Automated Security Analysis (Hermes Agent)

---

## Executive Summary

| Severity | Count |
|----------|-------|
| Critical | 2     |
| High     | 3     |
| Medium   | 5     |
| Low      | 3     |

**Overall Assessment:** The contracts demonstrate solid fundamentals — CEI pattern, SafeERC20, UUPS upgradeability, Pausable, ReentrancyGuard, and custom errors. However, several issues must be addressed before mainnet deployment, particularly around shared state consistency, unbounded loops, and missing access controls on agent-owner operations.

---

## Critical Findings

### C-1: Quest Status Overwritten by First Completer (QuestFactory)

**File:** `QuestFactory.sol:116-118`  
**Impact:** Permanent denial of rewards for all other participants.

```solidity
if (_completedTaskCount[questId][msg.sender] == _totalTasks[questId]) {
    _quests[questId].status = QuestStatus.Completed; // <-- shared state!
    emit QuestCompleted(questId, msg.sender);
}
```

When the first user completes all tasks, `q.status` is set to `Completed` globally. This means:
- All other participants can no longer call `completeTask` (line 107 checks `status == Active`).
- All other participants can call `claimReward` without completing tasks (line 129 checks `status == Completed`).

**Recommendation:** Remove the shared status mutation. Track per-user completion separately:

```solidity
mapping(uint256 => mapping(address => bool)) private _questCompletedByUser;

// In completeTask:
if (_completedTaskCount[questId][msg.sender] == _totalTasks[questId]) {
    _questCompletedByUser[questId][msg.sender] = true;
    emit QuestCompleted(questId, msg.sender);
}

// In claimReward:
if (!_questCompletedByUser[questId][msg.sender]) revert QuestNotCompleted();
```

### C-2: No Reward Token Funding Mechanism (QuestFactory)

**File:** `QuestFactory.sol:60-100`  
**Impact:** Claim transactions will revert with insufficient balance; quest system is non-functional for rewards.

`createQuest` stores `rewardToken` and `rewardAmount` but never transfers tokens from the creator into the contract. When users call `claimReward`, the contract attempts `safeTransfer` from its own balance — which is zero unless someone manually transfers tokens.

**Recommendation:** Add token escrow in `createQuest`:

```solidity
// After storing quest data:
IERC20(rewardToken).safeTransferFrom(msg.sender, address(this), rewardAmount * maxCompletions);
```

Or require a `fundQuest` function with explicit deposit and a `maxCompletions` cap.

---

## High Findings

### H-1: Unbounded Loops — DoS Risk (Both Contracts)

**File:** `QuestFactory.sol:84`, `AgentRegistry.sol:77`  
**Impact:** Gas exhaustion if task/token arrays are large.

Both `createQuest` and `registerAgent` iterate over unbounded `calldata` arrays. A malicious user could pass thousands of entries, causing the transaction to exceed block gas limit (or making `getCompletedTasks` / `getAllowedTokens` extremely expensive to read).

Additionally, `getCompletedTasks` (QuestFactory:160-172) iterates over all tasks per quest, which is unbounded.

**Recommendation:** Enforce maximum array lengths:

```solidity
if (tasks.length > 50) revert TooManyTasks();
if (allowedTokens.length > 100) revert TooManyTokens();
```

### H-2: Agent Owner Can Inflate `totalTransactions` Arbitrarily (AgentRegistry)

**File:** `AgentRegistry.sol:92-101`  
**Impact:** Misleading on-chain metrics; potential economic exploit if `totalTransactions` is used for staking/reputation.

`recordActivity` is callable by agent wallet or owner with any `transactionCount` value — no validation, no cap. An owner can set `totalTransactions` to `type(uint256).max` in a single call.

**Recommendation:** Add bounds or require off-chain proof:

```solidity
if (transactionCount == 0 || transactionCount > 1000) revert InvalidTransactionCount();
```

### H-3: `completeTask` Missing `nonReentrant` Guard (QuestFactory)

**File:** `QuestFactory.sol:105`  
**Impact:** Lower risk due to no external calls in the function, but inconsistent with `claimReward` which has the guard.

While `completeTask` doesn't make external calls today, a future upgrade could introduce them. The inconsistency also makes the codebase harder to audit.

**Recommendation:** Add `nonReentrant` to `completeTask` for defense-in-depth.

---

## Medium Findings

### M-1: `pauseAgent`/`unpauseAgent` Restricted to Contract Owner, Not Agent Owner (AgentRegistry)

**File:** `AgentRegistry.sol:106, 117`  
**Impact:** Centralization risk; agent owners cannot manage their own agents.

Only the contract `owner` (admin) can pause/unpause/stop agents. Agent creators have no control over their own agents. This is a trust assumption that should be documented or changed.

**Recommendation:** Allow both contract owner and agent owner:

```solidity
function pauseAgent(uint256 agentId) external {
    AgentConfig storage config = _agents[agentId];
    if (msg.sender != owner() && msg.sender != config.owner) revert OnlyAgentOwner();
    // ...
}
```

### M-2: Missing `onlyOwner` on `createQuest` — Reward Token Drain Risk (QuestFactory)

**File:** `QuestFactory.sol:60`  
**Impact:** If reward funding is added, anyone can create quests with arbitrary reward amounts/tokens, potentially tricking users into completing tasks for unbacked rewards.

**Recommendation:** Add access control or whitelisting for quest creators if rewards are funded.

### M-3: Duplicate Token Registration Possible (AgentRegistry)

**File:** `AgentRegistry.sol:77-80`  
**Impact:** Storage waste; misleading `getAllowedTokens` output with duplicates.

The loop pushes to `_allowedTokens` without checking if the token already exists in `_tokenLookup`.

**Recommendation:** Skip duplicates:

```solidity
if (_tokenLookup[agentId][allowedTokens[i]]) continue;
```

### M-4: Missing `receive()`/`fallback()` and No AVAX Withdrawal Function (QuestFactory)

**Impact:** If AVAX is accidentally sent to the contract, it's permanently locked.

**Recommendation:** Add an owner-only AVAX rescue function or document that the contract should never receive AVAX.

### M-5: No `title` Validation — Empty Strings Accepted (Both Contracts)

**File:** `QuestFactory.sol:60`, `AgentRegistry.sol:52`  
**Impact:** Garbage data on-chain; poor UX in frontends.

**Recommendation:** Add minimum length checks:

```solidity
if (bytes(title).length == 0) revert EmptyTitle();
```

---

## Low Findings

### L-1: Type Duplication Between `Types.sol` and Interfaces

`Types.sol` defines `TaskType`, `QuestStatus`, `AgentType`, `AgentStatus` — but `IQuestFactory.sol` and `IAgentRegistry.sol` also define identical enums. The contracts import from interfaces, not the library. `Types.sol` is effectively unused.

**Recommendation:** Remove duplicate enums from interfaces and import from `Types.sol`, or remove `Types.sol` entirely.

### L-2: `ReentrancyGuard` Imported from Non-Upgradeable OZ (QuestFactory)

**File:** `QuestFactory.sol:7`  
**Impact:** Functional but inconsistent. `ReentrancyGuard` storage slot is deterministic but mixing upgradeable/non-upgradeable imports is a maintenance hazard.

**Recommendation:** Use `@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol` and call `__ReentrancyGuard_init()` in `initialize`.

### L-3: Missing `indexed` Parameters in Events

`AgentActivity` does not index `transactionCount`. Minor for off-chain indexing efficiency.

---

## Recommendations

### Immediate (Before Mainnet)

1. **Fix C-1** — Per-user quest completion tracking (critical logic bug).
2. **Fix C-2** — Add token escrow/funding mechanism.
3. **Fix H-1** — Add array length caps.
4. **Fix L-2** — Use consistent upgradeable OZ imports.
5. **Run Slither + Mythril** static analysis.
6. **Write Foundry fuzz tests** for `completeTask`/`claimReward` multi-user scenarios.

### Short-Term (Within 1 Month)

1. Add `recordActivity` bounds (H-2).
2. Grant agent owners pause/unpause rights (M-1).
3. Add duplicate token check (M-3).
4. Add AVAX rescue function (M-4).
5. Deduplicate types (L-1).
6. Commission professional audit from a firm (Trail of Bits, OpenZeppelin, Halborn).

### Long-Term (Nice to Have)

1. Add event `QuestFunded` with amount tracking.
2. Implement quest expiration using `QuestStatus.Expired`.
3. Add `maxDailyTransactions` enforcement in `recordActivity`.
4. Add NatSpec to all interface functions.
5. Implement off-chain task verification (oracle/keeper pattern).

---

## Pre-Mainnet Audit Checklist

### Access Control
- [ ] Verify `onlyOwner` on `pause`/`unpause`/`stopAgent`/`_authorizeUpgrade`
- [ ] Verify `msg.sender` checks in `completeTask` (implicit — anyone can complete their own tasks)
- [ ] Verify `msg.sender` checks in `recordActivity` (owner or wallet)
- [ ] Test `transferOwnership` behavior — does it break agent owner assumptions?
- [ ] Verify `initializer` prevents re-initialization

### Upgrade Safety
- [ ] Verify UUPS `_authorizeUpgrade` is `onlyOwner`
- [ ] Test storage layout compatibility with V2 contracts
- [ ] Verify `initializer` modifier blocks re-initialization after upgrade
- [ ] Test that `ReentrancyGuard` storage slot doesn't conflict with upgradeable pattern
- [ ] Document upgrade process and timelock expectations

### Economic Attack Vectors
- [ ] Verify reward token balance before any claim
- [ ] Test griefing: user creates quest, others complete, creator has no funds
- [ ] Test front-running `completeTask` (low risk — user-specific state)
- [ ] Test front-running `claimReward` (low risk — per-user, already claimed check)
- [ ] Verify `rewardAmount` cannot be manipulated post-creation

### Edge Cases
- [ ] Zero-length task arrays (should revert — verified)
- [ ] Quest ID 0 (never assigned — `_questCounter` starts at 0, first quest = 1)
- [ ] Agent ID 0 (same pattern — verified)
- [ ] `stopLossBps = 10000` (100% — accepted, document if intended)
- [ ] Re-registering same wallet for multiple agents (allowed — verify if intended)
- [ ] Large array DoS (needs fix — see H-1)
- [ ] `getCompletedTasks` with no completed tasks (returns empty array — correct)

### Proxy & Deployment
- [ ] Verify proxy admin is a multisig (not EOA)
- [ ] Verify implementation contracts are not initialized directly
- [ ] Test `upgradeToAndCall` with malicious implementation (should fail for non-owner)
- [ ] Verify `initializer` uses `onlyInitializing` modifier pattern
- [ ] Document proxy addresses and implementation versions

---

## Tools & Resources

### Recommended Static Analysis
- **Slither** — `slither . --print human-summary` — detects 70+ vulnerability patterns
- **Mythril** — `myth analyze contracts/QuestFactory.sol` — symbolic execution
- **Aderyn** — Rust-based detector, fast for large codebases

### Fuzzing & Formal Verification
- **Echidna** — Property-based fuzzing (test multi-user quest completion)
- **Foundry Fuzz** — `forge test --fuzz-runs 10000`
- **Certora Prover** — Formal verification for critical invariants

### Bug Bounty Platforms
- **Immunefi** — Industry standard for DeFi protocols
- **Code4rena** — Competitive audit contests
- **Sherlock** — Audit + bug bounty hybrid

### Audit Firms
- OpenZeppelin — UUPS/proxy specialists
- Trail of Bits — Deep symbolic analysis
- Halborn — Avalanche ecosystem experience
- Zellic — Emerging firm, strong DeFi track record

---

## Summary

The codebase follows many best practices (CEI, SafeERC20, custom errors, UUPS) but has two critical bugs that must be fixed before mainnet: **shared quest status mutation** (C-1) and **missing reward escrow** (C-2). The unbounded loop issue (H-1) is a high-priority gas/DoS fix. All other findings are medium-to-low severity.

**Verdict: NOT ready for mainnet. Fix C-1, C-2, H-1, then re-audit.**
