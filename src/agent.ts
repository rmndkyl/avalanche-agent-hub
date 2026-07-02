// Agent Kit - Deploy and manage AI agents

import { HubConfig, Agent, AgentRules } from './types';
import { read, write } from './db';

const TABLE = 'agents';

interface AgentRecord extends Omit<Agent, 'createdAt'> {
  createdAt: string;
  metrics: {
    totalTransactions: number;
    totalVolume: string;
    lastActivity: string;
  };
}

export class AgentKit {
  private config: HubConfig;

  constructor(config: HubConfig) {
    this.config = config;
  }

  async deploy(params: {
    type: Agent['type'];
    wallet: string;
    rules: AgentRules;
  }): Promise<Agent> {
    const now = new Date().toISOString();
    const record: AgentRecord = {
      id: this.generateId(),
      type: params.type,
      wallet: params.wallet,
      rules: params.rules,
      status: 'active',
      createdAt: now,
      metrics: { totalTransactions: 0, totalVolume: '0', lastActivity: now },
    };
    const all = read<AgentRecord>(TABLE);
    all.push(record);
    write(TABLE, all);
    return this.toAgent(record);
  }

  async status(agentId: string): Promise<{
    agent: Agent;
    metrics: {
      totalTransactions: number;
      totalVolume: string;
      lastActivity: Date;
    };
  } | null> {
    const all = read<AgentRecord>(TABLE);
    const rec = all.find(a => a.id === agentId);
    if (!rec) return null;
    return {
      agent: this.toAgent(rec),
      metrics: {
        totalTransactions: rec.metrics.totalTransactions,
        totalVolume: rec.metrics.totalVolume,
        lastActivity: new Date(rec.metrics.lastActivity),
      },
    };
  }

  async pause(agentId: string): Promise<boolean> {
    return this.updateStatus(agentId, 'paused');
  }

  async stop(agentId: string): Promise<boolean> {
    return this.updateStatus(agentId, 'stopped');
  }

  async listAgents(filters?: {
    type?: Agent['type'];
    status?: Agent['status'];
  }): Promise<Agent[]> {
    const all = read<AgentRecord>(TABLE);
    let result = all;
    if (filters?.type) result = result.filter(a => a.type === filters.type);
    if (filters?.status) result = result.filter(a => a.status === filters.status);
    return result.map(a => this.toAgent(a));
  }

  private updateStatus(agentId: string, status: Agent['status']): boolean {
    const all = read<AgentRecord>(TABLE);
    const rec = all.find(a => a.id === agentId);
    if (!rec) return false;
    rec.status = status;
    write(TABLE, all);
    return true;
  }

  private toAgent(r: AgentRecord): Agent {
    return { ...r, createdAt: new Date(r.createdAt) };
  }

  private generateId(): string {
    return `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
