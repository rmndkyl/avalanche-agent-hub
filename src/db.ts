import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');

function ensureDir(): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

export function read<T = Record<string, unknown>>(name: string): T[] {
  ensureDir();
  const file = join(DATA_DIR, `${name}.json`);
  if (!existsSync(file)) return [];
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as T[];
  } catch {
    return [];
  }
}

export function write<T>(name: string, data: T[]): void {
  ensureDir();
  const file = join(DATA_DIR, `${name}.json`);
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}
