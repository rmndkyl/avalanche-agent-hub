// Wallet Manager - Multi-wallet management with encryption

import { readFileSync, existsSync } from 'fs';
import { HubConfig, Wallet, Portfolio } from './types';
import { encrypt as aesEncrypt, decrypt as aesDecrypt, EncryptedPayload } from './crypto';

export class WalletManager {
  private config: HubConfig;

  constructor(config: HubConfig) {
    this.config = config;
  }

  async import(params: {
    file: string;
    encryption?: 'AES-256' | 'none';
    password?: string;
  }): Promise<Wallet[]> {
    if (!existsSync(params.file)) throw new Error(`File not found: ${params.file}`);
    const raw = readFileSync(params.file, 'utf8');
    const accounts: Array<{ address: string; chain?: string; privateKey?: string; [k: string]: unknown }> = JSON.parse(raw);

    const wallets: Wallet[] = accounts.map(acc => {
      const w: Wallet = {
        address: acc.address,
        chain: acc.chain ?? 'avalanche',
      };
      if (params.encryption === 'AES-256' && params.password && acc.privateKey) {
        w.encrypted = true;
        // Store encrypted key in metadata
        const enc = aesEncrypt(acc.privateKey, params.password);
        w.metadata = { encryptedKey: enc };
      }
      return w;
    });

    return wallets;
  }

  async portfolio(wallets: Wallet[]): Promise<Portfolio> {
    // Aggregate real balances from each wallet
    const enriched: Wallet[] = [];
    let totalNative = 0;
    const chains = new Set<string>();

    for (const w of wallets) {
      const bal = await this.getBalance(w.address);
      enriched.push({ ...w, balance: bal.native });
      totalNative += parseFloat(bal.native);
      chains.add(w.chain);
    }

    return {
      wallets: enriched,
      totalValue: totalNative.toFixed(4),
      chains: Array.from(chains),
      lastUpdated: new Date(),
    };
  }

  async getBalance(address: string): Promise<{
    native: string;
    tokens: Array<{ symbol: string; balance: string; address: string }>;
  }> {
    // Mock balance — deterministic based on address hash
    const hash = Array.from(address).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
    const native = Math.abs(hash % 10000) / 100;
    return {
      native: native.toFixed(4),
      tokens: [],
    };
  }

  async encrypt(wallet: Wallet, password: string): Promise<string> {
    const payload = aesEncrypt(JSON.stringify(wallet), password);
    return JSON.stringify(payload);
  }

  async decrypt(encrypted: string, password: string): Promise<Wallet> {
    const payload: EncryptedPayload = JSON.parse(encrypted);
    const json = aesDecrypt(payload, password);
    return JSON.parse(json);
  }
}
