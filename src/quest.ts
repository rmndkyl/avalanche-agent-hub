// Quest SDK - Create and verify on-chain quests

import { HubConfig, Quest, QuestTask, QuestReward } from './types';
import { read, write } from './db';

const TABLE = 'quests';

// Track wallet completions: { [questId]: Set<wallet> } — persisted in same DB row
interface QuestRecord extends Omit<Quest, 'createdAt'> {
  createdAt: string; // ISO string for JSON
  completions: Record<string, number>; // wallet → completed task count
}

export class QuestSDK {
  private config: HubConfig;

  constructor(config: HubConfig) {
    this.config = config;
  }

  async create(params: {
    title: string;
    chain: string;
    tasks: QuestTask[];
    rewards: QuestReward;
  }): Promise<Quest> {
    const quest: QuestRecord = {
      id: this.generateId(),
      title: params.title,
      chain: params.chain,
      tasks: params.tasks,
      rewards: params.rewards,
      status: 'active',
      createdAt: new Date().toISOString(),
      completions: {},
    };
    const all = read<QuestRecord>(TABLE);
    all.push(quest);
    write(TABLE, all);
    return this.toQuest(quest);
  }

  async verify(params: {
    questId: string;
    wallet: string;
  }): Promise<{ completed: boolean; progress: number }> {
    const all = read<QuestRecord>(TABLE);
    const quest = all.find(q => q.id === params.questId);
    if (!quest) throw new Error(`Quest ${params.questId} not found`);

    const totalTasks = quest.tasks.length;
    if (totalTasks === 0) return { completed: true, progress: 100 };

    // Mock verification: increment completion count each call (capped at totalTasks)
    const current = quest.completions[params.wallet] ?? 0;
    const next = Math.min(current + 1, totalTasks);
    quest.completions[params.wallet] = next;
    write(TABLE, all);

    const completed = next >= totalTasks;
    const progress = Math.round((next / totalTasks) * 100);
    return { completed, progress };
  }

  async getQuest(questId: string): Promise<Quest | null> {
    const all = read<QuestRecord>(TABLE);
    const q = all.find(r => r.id === questId);
    return q ? this.toQuest(q) : null;
  }

  async listQuests(filters?: {
    status?: Quest['status'];
    chain?: string;
  }): Promise<Quest[]> {
    const all = read<QuestRecord>(TABLE);
    let result = all;
    if (filters?.status) result = result.filter(q => q.status === filters.status);
    if (filters?.chain) result = result.filter(q => q.chain === filters.chain);
    return result.map(q => this.toQuest(q));
  }

  private toQuest(r: QuestRecord): Quest {
    return { ...r, createdAt: new Date(r.createdAt) };
  }

  private generateId(): string {
    return `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
