// Example 1: Create and verify an on-chain quest
// Run: node examples/quest-example.js

import { AgentHub } from '../src/index.js';

async function main() {
  const hub = AgentHub.create({ network: 'testnet' });

  // Create a quest
  const quest = await hub.quest.create({
    title: "Complete 5 swaps on Trader Joe",
    chain: "C-Chain",
    tasks: [
      { type: "on-chain", contract: "0x...", method: "swap", count: 5 },
      { type: "social", platform: "twitter", action: "follow" }
    ],
    rewards: { token: "AVAX", amount: 0.1 }
  });

  console.log("Quest created:", quest.id);

  // Verify completion
  const status = await hub.quest.verify({
    questId: quest.id,
    wallet: "0xDEDB5f8746F50620CBc9d8b7aF5F331969CbD2A4"
  });

  console.log("Completed:", status.completed, "Progress:", status.progress + "%");
}

main().catch(console.error);
