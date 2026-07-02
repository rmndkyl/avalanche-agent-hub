export const FUJI_RPC_URL = 'https://api.avax-test.network/ext/bc/C/rpc'
export const FUJI_CHAIN_ID = 43113
export const SNOWTRACE_BASE_URL = 'https://testnet.snowtrace.io/address'

export const deployment = {
  network: 'Avalanche Fuji Testnet',
  chainId: FUJI_CHAIN_ID,
  rpcUrl: FUJI_RPC_URL,
  explorerBaseUrl: SNOWTRACE_BASE_URL,
  deployer: '0xDEDB5f8746F50620CBc9d8b7aF5F331969CbD2A4',
  contracts: [
    {
      key: 'agentRegistry',
      name: 'AgentRegistry',
      address: '0x58aaa6Af773E419D3334fD671EA87bCea1bEF90c',
      purpose: 'AI agent lifecycle, wallet ownership, pause controls, activity tracking',
    },
    {
      key: 'questFactory',
      name: 'QuestFactory',
      address: '0x53ecd26D6D45fd19D5E0CE84E326124F55bf9DCA',
      purpose: 'Quest creation, task completion, reward escrow, reward claims',
    },
  ],
} as const

type RpcResponse<T> = {
  error?: { message?: string }
  result?: T
}

async function rpc<T>(method: string, params: unknown[] = []): Promise<T> {
  const res = await fetch(FUJI_RPC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`RPC ${method} failed: ${res.status}`)

  const data = (await res.json()) as RpcResponse<T>
  if (data.error?.message) throw new Error(data.error.message)
  if (typeof data.result === 'undefined') throw new Error(`RPC ${method} returned no result`)
  return data.result
}

function hexToNumber(hex: string) {
  return parseInt(hex, 16)
}

function hexToBigInt(hex: string) {
  return BigInt(hex)
}

function formatUnits(value: bigint, decimals: number, digits: number) {
  const divisor = 10 ** decimals
  return (Number(value) / divisor).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
}

export async function getLiveDashboardData() {
  const [blockHex, gasHex, chainHex, deployerBalanceHex, contractCodes] = await Promise.all([
    rpc<string>('eth_blockNumber'),
    rpc<string>('eth_gasPrice'),
    rpc<string>('eth_chainId'),
    rpc<string>('eth_getBalance', [deployment.deployer, 'latest']),
    Promise.all(deployment.contracts.map((contract) => rpc<string>('eth_getCode', [contract.address, 'latest']))),
  ])

  return {
    network: deployment.network,
    chainId: hexToNumber(chainHex),
    expectedChainId: deployment.chainId,
    blockNumber: hexToNumber(blockHex),
    gasPriceGwei: formatUnits(hexToBigInt(gasHex), 9, 2),
    deployerBalanceAvax: formatUnits(hexToBigInt(deployerBalanceHex), 18, 4),
    refreshedAt: new Date().toISOString(),
    contracts: deployment.contracts.map((contract, index) => {
      const code = contractCodes[index]
      return {
        ...contract,
        explorerUrl: `${deployment.explorerBaseUrl}/${contract.address}`,
        deployed: code !== '0x',
        codeBytes: Math.max((code.length - 2) / 2, 0),
      }
    }),
  }
}
