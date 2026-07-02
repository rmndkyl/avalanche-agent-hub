import hre from "hardhat";
const { ethers } = hre;
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

/**
 * Deploy a UUPS proxy for an upgradeable contract.
 * @param name Contract factory name
 * @param initializer Initializer function name (default "initialize")
 * @param args Initializer args
 * @returns proxied contract instance attached to the proxy address
 */
export async function deployUUPS(name, initializer = "initialize", args = []) {
  const Factory = await ethers.getContractFactory(name);
  const impl = await Factory.deploy();
  await impl.waitForDeployment();
  const implAddr = await impl.getAddress();

  const initData = Factory.interface.encodeFunctionData(initializer, args);
  const ERC1967Proxy = await ethers.getContractFactory("ERC1967Proxy");
  const proxy = await ERC1967Proxy.deploy(implAddr, initData);
  await proxy.waitForDeployment();

  const proxied = Factory.attach(await proxy.getAddress());
  return { proxied, impl, proxy, implAddr };
}

/** Full QuestFactory fixture: deploy proxy + mock reward token, mint to creator. */
export async function deployQuestFactoryFixture() {
  const [owner, creator, userA, userB, other] = await ethers.getSigners();

  const { proxied: questFactory } = await deployUUPS("QuestFactory", "initialize", [owner.address]);

  const Token = await ethers.getContractFactory("MockERC20");
  const rewardToken = await Token.deploy("Reward", "RWD", 18);
  await rewardToken.waitForDeployment();

  const REWARD_AMOUNT = ethers.parseEther("100");
  const FUND_AMOUNT = ethers.parseEther("1000");
  await rewardToken.mint(creator.address, FUND_AMOUNT);

  return { questFactory, rewardToken, owner, creator, userA, userB, other, REWARD_AMOUNT, FUND_AMOUNT };
}

/** Full AgentRegistry fixture. */
export async function deployAgentRegistryFixture() {
  const [owner, agentOwner, agentWallet, other] = await ethers.getSigners();

  const { proxied: agentRegistry } = await deployUUPS("AgentRegistry", "initialize", [owner.address]);

  return { agentRegistry, owner, agentOwner, agentWallet, other };
}

// Re-export loadFixture so tests import everything from one place if desired
export { loadFixture };
