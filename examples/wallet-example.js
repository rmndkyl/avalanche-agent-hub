// Example 3: Multi-wallet portfolio management
// Run: node examples/wallet-example.js

import { AgentHub } from '../src/index.js';

async function main() {
  const hub = AgentHub.create({ network: 'testnet' });

  // Import wallets from JSON file
  const wallets = await hub.wallet.import({
    file: './accounts.json',
    encryption: 'AES-256',
    password: 'super-secret-password'
  });

  console.log("Imported wallets:", wallets.length);
  wallets.forEach(w => console.log("  -", w.address));

  // Get aggregated portfolio
  const portfolio = await hub.wallet.portfolio(wallets);
  console.log("Total value:", portfolio.totalValue);
  console.log("Chains:", portfolio.chains.join(', '));

  // Get individual balance
  const balance = await hub.wallet.getBalance('0xDEDB5f8746F50620CBc9d8b7aF5F331969CbD2A4');
  console.log("Native balance:", balance.native);
  console.log("Tokens:", balance.tokens.length);
}

main().catch(console.error);
