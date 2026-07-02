# Wallet Manager Guide

Import, encrypt, and track wallets across Avalanche chains.

## Importing Wallets

### JSON file format

```json
[
  {
    "address": "0x...",
    "chain": "avalanche",
    "privateKey": "0x..."  // optional, used if unencrypted
  }
]
```

```typescript
const wallets = await hub.wallet.import({
  file: './wallets.json',
  encryption: 'AES-256',
  password: process.env.WALLET_PASSWORD,
});
```

### Without encryption

```typescript
const wallets = await hub.wallet.import({
  file: './wallets.json',
  encryption: 'none',
});
```

## AES-256 Encryption

Encrypt wallets at rest. All crypto ops use AES-256-GCM.

### Encrypt

```typescript
const encrypted = await hub.wallet.encrypt(wallet, 'my-strong-password');
// Returns encrypted string for storage
```

### Decrypt

```typescript
const wallet = await hub.wallet.decrypt(encryptedData, 'my-strong-password');
```

**Rules:**
- Never hardcode passwords. Use env vars or a secrets manager.
- Rotate passwords periodically.
- Encrypted output is self-contained — store it directly, no extra metadata needed.

## Portfolio Tracking

Aggregate balances across multiple wallets and chains.

```typescript
const portfolio = await hub.wallet.portfolio(wallets);
// {
//   wallets: Wallet[],
//   totalValue: '12500.00',
//   chains: ['avalanche', 'ethereum'],
//   lastUpdated: 2025-01-15T10:30:00Z
// }
```

### Per-wallet balance

```typescript
const balance = await hub.wallet.getBalance('0x...');
// {
//   native: '10.5',
//   tokens: [
//     { symbol: 'USDC', balance: '1000', address: '0x...' },
//     { symbol: 'JOE', balance: '50', address: '0x...' },
//   ]
// }
```

## Multi-Chain Support

Each wallet has a `chain` field. Supported chains:

| Chain | Identifier |
|-------|------------|
| Avalanche C-Chain | `avalanche` |
| Ethereum | `ethereum` |
| Arbitrum | `arbitrum` |

```typescript
const wallet: Wallet = {
  address: '0x...',
  chain: 'avalanche',
  balance: '10.5',
  encrypted: true,
  metadata: { label: 'Trading Wallet' },
};
```

## Wallet Type Reference

```typescript
interface Wallet {
  address: string;
  chain: string;
  balance?: string;
  encrypted?: boolean;
  metadata?: Record<string, unknown>;
}

interface Portfolio {
  wallets: Wallet[];
  totalValue: string;
  chains: string[];
  lastUpdated: Date;
}
```
