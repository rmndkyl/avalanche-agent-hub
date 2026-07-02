'use client'

import { useState } from 'react'
import { deployment, FUJI_RPC_URL } from '@/lib/avalanche'

const networks = [
  { key: 'mainnet', label: 'Mainnet', description: 'Avalanche C-Chain production', disabled: true },
  { key: 'testnet', label: 'Testnet', description: 'Fuji Testnet active deployment', disabled: false },
] as const

export default function SettingsPage() {
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('testnet')

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted mt-1">Current project config. No wallet write actions yet.</p>
      </div>

      <section className="bg-card rounded-xl p-5 border border-white/5 space-y-3">
        <h2 className="font-semibold text-sm">Network</h2>
        <div className="flex gap-2 flex-wrap">
          {networks.map((n) => (
            <button
              key={n.key}
              onClick={() => !n.disabled && setNetwork(n.key)}
              disabled={n.disabled}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                network === n.key
                  ? 'bg-accent text-white'
                  : 'bg-surface border border-white/5 text-muted hover:text-text'
              } ${n.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {n.label}
            </button>
          ))}
        </div>
        <p className="text-muted text-xs">
          {networks.find((item) => item.key === network)?.description}
        </p>
      </section>

      <section className="bg-card rounded-xl p-5 border border-white/5 space-y-3">
        <h2 className="font-semibold text-sm">RPC</h2>
        <div className="bg-surface border border-white/5 rounded-lg px-4 py-3 font-mono text-xs break-all text-muted">
          {FUJI_RPC_URL}
        </div>
        <p className="text-muted text-xs">Dashboard pages fetch live chain data from this endpoint.</p>
      </section>

      <section className="bg-card rounded-xl p-5 border border-white/5 space-y-3">
        <h2 className="font-semibold text-sm">Deployment</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted">Chain ID</span>
            <span>{deployment.chainId}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted">Deployer</span>
            <span className="font-mono text-xs">{deployment.deployer}</span>
          </div>
          {deployment.contracts.map((contract) => (
            <div key={contract.address} className="flex items-center justify-between gap-4">
              <span className="text-muted">{contract.name}</span>
              <span className="font-mono text-xs">{contract.address.slice(0, 10)}...{contract.address.slice(-6)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
