import { deployment, getLiveDashboardData } from '@/lib/avalanche'

export default async function AgentsPage() {
  const live = await getLiveDashboardData()
  const agentRegistry = live.contracts.find((contract) => contract.key === 'agentRegistry')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Agents</h1>
          <p className="text-sm text-muted mt-1">Live deployment metadata for AgentRegistry on Fuji.</p>
        </div>
        <a
          href={agentRegistry?.explorerUrl}
          target="_blank"
          rel="noreferrer"
          className="bg-accent text-white text-sm font-medium rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
        >
          Open Contract
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <p className="text-muted text-sm">Registry Status</p>
          <p className="text-2xl font-bold mt-1">{agentRegistry?.deployed ? 'Live' : 'Missing'}</p>
          <p className="text-green-400 text-sm mt-1">Fuji RPC checked</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <p className="text-muted text-sm">Chain</p>
          <p className="text-2xl font-bold mt-1">{deployment.chainId}</p>
          <p className="text-green-400 text-sm mt-1">Avalanche Fuji</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <p className="text-muted text-sm">Bytecode Size</p>
          <p className="text-2xl font-bold mt-1">{agentRegistry?.codeBytes.toLocaleString('en-US') ?? '0'}</p>
          <p className="text-green-400 text-sm mt-1">On-chain code present</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-muted text-left">
                <th className="px-5 py-3 font-medium">Field</th>
                <th className="px-5 py-3 font-medium">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-5 py-3 font-medium">Contract</td>
                <td className="px-5 py-3">AgentRegistry</td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Address</td>
                <td className="px-5 py-3 font-mono text-xs break-all text-muted">{agentRegistry?.address}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Deployer</td>
                <td className="px-5 py-3 font-mono text-xs break-all text-muted">{live.deployerBalanceAvax} AVAX at {deployment.deployer}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Purpose</td>
                <td className="px-5 py-3 text-muted">{agentRegistry?.purpose}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Last Snapshot</td>
                <td className="px-5 py-3 text-muted">{new Date(live.refreshedAt).toLocaleString('en-US')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
