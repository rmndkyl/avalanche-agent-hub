// Example 2: Deploy a trading agent
// Run: node examples/agent-example.js

import { AgentHub } from '../src/index.js';

async function main() {
  const hub = AgentHub.create({ network: 'testnet' });

  // Deploy a trading agent
  const agent = await hub.agent.deploy({
    type: 'trader',
    wallet: '0xDEDB5f8746F50620CBc9d8b7aF5F331969CbD2A4',
    rules: {
      maxTradeSize: '100',
      allowedTokens: ['AVAX', 'USDC', 'JOE'],
      stopLoss: '5',
      takeProfit: '10',
      maxDailyTransactions: 50
    }
  });

  console.log("Agent deployed:", agent.id);
  console.log("Type:", agent.type);
  console.log("Status:", agent.status);

  // List all agents
  const agents = await hub.agent.listAgents({ status: 'active' });
  console.log("Active agents:", agents.length);
}

main().catch(console.error);
