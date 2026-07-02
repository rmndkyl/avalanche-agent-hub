import { getLiveDashboardData } from '@/lib/avalanche'

const quickActions = [
  { label: 'View AgentRegistry', href: 'https://testnet.snowtrace.io/address/0x58aaa6Af773E419D3334fD671EA87bCea1bEF90c' },
  { label: 'View QuestFactory', href: 'https://testnet.snowtrace.io/address/0x53ecd26D6D45fd19D5E0CE84E326124F55bf9DCA' },
  { label: 'Open npm Package', href: 'https://www.npmjs.com/package/agent-hub-avax' },
]

export default async function Home() {
  const live = await getLiveDashboardData()

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted mt-1">Live Fuji RPC snapshot. Refreshed {new Date(live.refreshedAt).toLocaleString('en-US')}</p>
        </div>
        <div className="text-right text-xs text-muted">
          <div>{live.network}</div>
          <div>Chain ID {live.chainId}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <p className="text-muted text-sm">Latest Block</p>
          <p className="text-2xl font-bold mt-1">{live.blockNumber.toLocaleString('en-US')}</p>
          <p className="text-green-400 text-sm mt-1">Live RPC</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <p className="text-muted text-sm">Gas Price</p>
          <p className="text-2xl font-bold mt-1">{live.gasPriceGwei} gwei</p>
          <p className="text-green-400 text-sm mt-1">Fuji</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <p className="text-muted text-sm">Deployer Balance</p>
          <p className="text-2xl font-bold mt-1">{live.deployerBalanceAvax} AVAX</p>
          <p className="text-green-400 text-sm mt-1">{live.contracts.filter((c) => c.deployed).length}/{live.contracts.length} contracts live</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <p className="text-muted text-sm">Explorer</p>
          <p className="text-2xl font-bold mt-1">Snowtrace</p>
          <p className="text-green-400 text-sm mt-1">Fuji Testnet</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((a) => (
            <a
              key={a.label}
              href={a.href}
              target="_blank"
              rel="noreferrer"
              className="bg-surface border border-white/5 rounded-lg px-5 py-3 hover:border-accent/40 transition-colors text-sm"
            >
              {a.label}
            </a>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Live Contracts</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {live.contracts.map((contract) => (
            <div key={contract.address} className="bg-surface rounded-xl border border-white/5 p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{contract.name}</h3>
                  <p className="text-sm text-muted mt-1">{contract.purpose}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${contract.deployed ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                  {contract.deployed ? 'Live' : 'Missing'}
                </span>
              </div>
              <div className="font-mono text-xs break-all text-muted">{contract.address}</div>
              <div className="flex items-center justify-between text-xs text-muted gap-4">
                <span>Bytecode: {contract.codeBytes.toLocaleString('en-US')} bytes</span>
                <a href={contract.explorerUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                  Open Snowtrace
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
