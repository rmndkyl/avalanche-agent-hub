# Avalanche Agent Hub — Brand Guidelines

## 1. Brand Identity

### Name
**Avalanche Agent Hub** — always written as three words, title case. Never "AvalancheAgentHub", "AAH", or "agent-hub" in user-facing text.

### Tagline Options
1. *"Open-source developer toolkit for deploying AI agents, managing multi-wallet operations, and creating on-chain quests on Avalanche."* (full — for hero/landing)
2. *"Battle-tested tools for the agentic economy on Avalanche."* (short — for pitches/social)
3. *"Ship AI agents on Avalanche. Battle-tested, open-source, production-ready."* (punchy — for grants/badges)

### Brand Voice
Technical but approachable. Confident but humble. We don't oversell — the code speaks.

| Context | Tone |
|---------|------|
| Technical docs | Clear, concise, code-first |
| Marketing copy | Confident, benefit-focused |
| Social media | Community-oriented, helpful |
| Grant applications | Professional, data-driven |

### Brand Values
- **Open-source**: MIT licensed, community contributions welcome
- **Battle-tested**: Built from 11+ production bots, not theoretical
- **Community-first**: Built for developers, by developers

---

## 2. Visual Identity

### Color Palette

#### Primary
| Token | Hex | Usage |
|-------|-----|-------|
| `--accent` | `#E84142` | Primary brand, CTAs, highlights |
| `--accent2` | `#FF6B6B` | Hover states, secondary highlights |

#### Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#0A0A0F` | Page background, deepest layer |
| `--surface` | `#12121A` | Section backgrounds, elevated layers |
| `--card` | `#1A1A25` | Cards, code blocks, inputs |

#### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `--text` | `#E8E8ED` | Primary text |
| `--muted` | `#8888A0` | Secondary text, descriptions |

#### UI
| Token | Hex | Usage |
|-------|-----|-------|
| `--border` | `#2A2A3A` | Borders, dividers |

#### Accent Modules (optional semantic colors for module differentiation)
| Module | Suggested Hex | Usage |
|--------|--------------|-------|
| Quest SDK | `#4ECDC4` | Quest-related highlights |
| Agent Kit | `#45B7D1` | Agent-related highlights |
| Wallet Manager | `#96CEB4` | Wallet-related highlights |

### Typography

**Font stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
**Monospace:** `'SF Mono', 'Fira Code', monospace`

| Element | Size | Weight | Line-height |
|---------|------|--------|-------------|
| h1 | `clamp(2.5rem, 6vw, 4rem)` | 700 | 1.2 |
| h2 | `2rem` | 700 | 1.2 |
| h3 | `1.25rem` | 600 | 1.4 |
| Body | `1rem` | 400 | 1.6 |
| Small/labels | `0.85–0.9rem` | 400–600 | 1.5 |
| Code | `0.85–0.9rem` | 400 | 1.6 |

### Spacing Scale
`0.25rem` → `0.5rem` → `0.75rem` → `1rem` → `1.5rem` → `2rem` → `3rem` → `4rem` → `6rem`

### Border Radius
| Element | Radius |
|---------|--------|
| Buttons | `8px` |
| Cards | `12px` |
| Code blocks | `8px` |
| Badges/pills | `20px` |
| Inline code | `4px` |

---

## 3. Logo Usage

### Logomark
**🔺** (triangle emoji) — used as primary logomark across all pages.

### Text Treatment
```
Avalanche Agent Hub
    ────────  ───────
    default   accent (#E84142)
```

- "Avalanche" in default text color (`#E8E8ED`)
- "Agent Hub" in accent color (`#E84142`)
- Always `<h1>` or equivalent heading level

### Clear Space
Minimum clear space around logo = 1× the height of the logomark on all sides.

### Minimum Size
- Logomark: 32px minimum
- Full wordmark: 120px minimum width

---

## 4. Voice & Tone by Context

### Technical Documentation
- Lead with code. Explain what, not why (unless non-obvious)
- One concept per section
- Use `const`/`await` examples, not pseudocode
- API names match exactly: `hub.quest.create()`, `hub.agent.deploy()`, `hub.wallet.portfolio()`

### Marketing / Landing Pages
- Lead with the problem, then the solution
- Use concrete numbers: "550+ projects", "$33M ecosystem", "715M+ agent calls"
- "Battle-tested" is the core proof point
- Avoid superlatives without evidence

### Grant Applications
- Lead with ecosystem impact, not team credentials
- Specific milestones with timeframes (30-day, 90-day)
- Budget broken into line items
- Reference Avalanche Team1 / KiteAI alignment

### Social Media
- Helpful first, promotional second
- Share code snippets, not marketing copy
- Tag `@AgentHubAvax` for attribution

---

## 5. Content Guidelines

### Do's
✅ Use "Avalanche Agent Hub" (full name) at least once per page
✅ Use "battle-tested" as proof language
✅ Reference official `@avalanche-sdk/client` as the foundation
✅ Show real code in documentation
✅ Mention MIT license and open-source nature
✅ Use 🔺 as logomark

### Don'ts
❌ Never abbreviate to "AAH" or "A.A.H."
❌ Don't claim "first" without verification
❌ Don't use vague language ("revolutionary", "game-changing")
❌ Don't mix terminology: it's "Quest SDK" not "Quest System" or "Quest Engine"
❌ Don't use colors outside the palette without documenting them
❌ Don't use inline styles for brand-critical colors (use CSS variables)

### Approved Terminology
| ✅ Use | ❌ Don't Use |
|--------|-------------|
| Quest SDK | Quest System / Quest Engine |
| Agent Kit | Agent Framework / Agent Toolkit (inconsistency) |
| Wallet Manager | Wallet System / Multi-Wallet Tool |
| battle-tested | battle-tested (lowercase only in prose) |
| developer toolkit | developer kit / dev toolkit |
| on-chain quests | on-chain tasks / blockchain quests |
| open-source | open source (as adjective: hyphenated) |

### Competitive Positioning
- vs. custom-built solutions: "Save weeks of development. Production-ready from day one."
- vs. proprietary agent platforms: "Open-source. Your code, your wallets, your control."
- vs. generic blockchain SDKs: "Avalanche-native. First-class C-Chain, L1, and Subnet support."

---

## 6. Cross-Page Consistency Audit

### CSS Variables
| Variable | index.html | pitch.html | docs.html | Status |
|----------|-----------|-----------|----------|--------|
| `--bg` | `#0a0a0f` | `#0a0a0f` | `#0a0a0f` | ✅ Consistent |
| `--surface` | `#12121a` | `#12121a` | `#12121a` | ✅ Consistent |
| `--card` | `#1a1a25` | `#1a1a25` | `#1a1a25` | ✅ Consistent |
| `--accent` | `#e84142` | `#e84142` | `#e84142` | ✅ Consistent |
| `--accent2` | `#ff6b6b` | ❌ MISSING | ❌ MISSING | ⚠️ Add to all |
| `--text` | `#e8e8ed` | `#e8e8ed` | `#e8e8ed` | ✅ Consistent |
| `--muted` | `#8888a0` | `#8888a0` | `#8888a0` | ✅ Consistent |
| `--border` | `#2a2a3a` | `#2a2a3a` | `#2a2a3a` | ✅ Consistent |

### Typography
| Property | index.html | pitch.html | docs.html | Status |
|----------|-----------|-----------|----------|--------|
| font-family | system stack | system stack | system stack | ✅ Consistent |
| line-height (body) | 1.6 | ❌ NOT SET | 1.7 | ⚠️ Normalize to 1.6 |
| h1 font-weight | 700 | default | default | ⚠️ Add to all |

### Descriptions
| Page | Description Text | Status |
|------|-----------------|--------|
| index.html | "...deploying AI agents, managing multi-wallet operations, and creating on-chain quests on Avalanche." | ✅ Full |
| pitch.html | Same as index.html | ✅ Full |
| docs.html | "...deploying AI agents and managing multi-wallet operations on Avalanche." | ⚠️ Missing "and creating on-chain quests" |
| README.md | "...deploying AI agents and managing multi-wallet operations on Avalanche." | ⚠️ Same omission |

### Module Count
| Page | Claimed | Shown | Status |
|------|---------|-------|--------|
| index.html stats | "4 Core Modules" | 3 cards (Quest, Agent, Wallet) | ⚠️ Mismatch |
| pitch.html | 3 solution items | 3 | ✅ |
| docs.html | 3 module sections | 3 | ✅ |
| README.md | 3 modules | 3 | ✅ |

### Title Format
| Page | Title | Status |
|------|-------|--------|
| index.html | `Avalanche Agent Hub — Developer Toolkit for AI Agents on Avalanche` | ✅ |
| pitch.html | `Avalanche Agent Hub — Pitch Deck` | ✅ |
| docs.html | `Docs — Avalanche Agent Hub` | ⚠️ Inconsistent order |

### Footer / Attribution
| Page | Attribution | Status |
|------|------------|--------|
| index.html | "Built by Layer Airdrop ID" + "Supported by Avalanche Team1 Builder Grants" | ✅ |
| docs.html | "Built by Layer Airdrop ID • MIT License" | ✅ |
| pitch.html | "Contact: @AgentHubAvax on Twitter" | ✅ Updated |

---

## 7. Required Fixes

### Priority 1 (Brand Consistency)
1. **Add `--accent2: #ff6b6b`** to pitch.html and docs.html CSS variables
2. **Normalize `line-height`** to 1.6 on all pages' `body` rule
3. **Fix docs.html description** to include "and creating on-chain quests"
4. **Fix README.md description** to match full tagline

### Priority 2 (Content Accuracy)
5. **Fix "4 Core Modules" stat** in index.html — either add a 4th module or change to "3"
6. **Fix docs.html title** to `Avalanche Agent Hub — Documentation`
7. **Add `h1 { font-weight: 700; }`** to pitch.html and docs.html

### Priority 3 (Attribution)
8. **Add "Built by Layer Airdrop ID"** to pitch.html footer/CTA
