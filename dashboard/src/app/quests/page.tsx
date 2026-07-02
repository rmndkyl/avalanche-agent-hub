import { deployment, getLiveDashboardData } from '@/lib/avalanche'

export default async function QuestsPage() {
  const live = await getLiveDashboardData()
  const questFactory = live.contracts.find((contract) => contract.key === 'questFactory')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quests</h1>
          <p className="text-sm text-muted mt-1">Live deployment metadata for QuestFactory on Fuji.</p>
        </div>
        <a
          href={questFactory?.explorerUrl}
          target="_blank"
          rel="noreferrer"
          className="bg-accent text-white text-sm font-medium rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
        >
          Open Contract
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <p className="text-muted text-sm">Factory Status</p>
          <p className="text-2xl font-bold mt-1">{questFactory?.deployed ? 'Live' : 'Missing'}</p>
          <p className="text-green-400 text-sm mt-1">Fuji RPC checked</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <p className="text-muted text-sm">Latest Block</p>
          <p className="text-2xl font-bold mt-1">{live.blockNumber.toLocaleString('en-US')}</p>
          <p className="text-green-400 text-sm mt-1">Network alive</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-white/5">
          <p className="text-muted text-sm">Bytecode Size</p>
          <p className="text-2xl font-bold mt-1">{questFactory?.codeBytes.toLocaleString('en-US') ?? '0'}</p>
          <p className="text-green-400 text-sm mt-1">On-chain code present</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="bg-surface rounded-xl border border-white/5 p-5 space-y-3">
          <h2 className="text-lg font-semibold">Deployment</h2>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-muted">Contract</div>
              <div>QuestFactory</div>
            </div>
            <div>
              <div className="text-muted">Address</div>
              <div className="font-mono text-xs break-all text-muted">{questFactory?.address}</div>
            </div>
            <div>
              <div className="text-muted">Network</div>
              <div>{deployment.network} ({deployment.chainId})</div>
            </div>
            <div>
              <div className="text-muted">Explorer</div>
              <a href={questFactory?.explorerUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                {questFactory?.explorerUrl}
              </a>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-white/5 p-5 space-y-3">
          <h2 className="text-lg font-semibold">Security Features</h2>
          <ul className="space-y-2 text-sm text-muted list-disc pl-5">
            <li>Per-user quest completion tracking</li>
            <li>Reward escrow via <span className="font-mono text-xs">fundQuest()</span></li>
            <li>MAX_TASKS guardrail</li>
            <li><span className="font-mono text-xs">nonReentrant</span> completion and claim flow</li>
            <li>Duplicate claim prevention</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
