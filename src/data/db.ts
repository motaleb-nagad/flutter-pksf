/*
 * Offline-first local database (IndexedDB via Dexie).
 *
 * The field app must work fully offline: every read and write goes to this local
 * store first. Writes also enqueue a SyncQueueItem so the app can show a pending
 * count and flush to a backend when connectivity returns (see syncQueue.ts).
 */
import Dexie, { type Table } from 'dexie';
import type { Beneficiary, SyncQueueItem, Worker } from '../domain/types';
import { SEED_BENEFICIARIES, SEED_WORKERS } from '../domain/seed';

export class MchDatabase extends Dexie {
  beneficiaries!: Table<Beneficiary, string>;
  workers!: Table<Worker, string>;
  syncQueue!: Table<SyncQueueItem, number>;

  constructor() {
    super('mch-surveillance');
    this.version(1).stores({
      beneficiaries: 'id, type, risk, village, next',
      workers: 'id, union, status',
      syncQueue: '++id, kind, createdAt',
    });
  }
}

export const db = new MchDatabase();

/** Populate the local DB on first run so the app is usable offline immediately. */
export async function ensureSeeded(): Promise<void> {
  const count = await db.beneficiaries.count();
  if (count === 0) {
    await db.beneficiaries.bulkAdd(SEED_BENEFICIARIES);
  }
  const workerCount = await db.workers.count();
  if (workerCount === 0) {
    await db.workers.bulkAdd(SEED_WORKERS);
  }
  // Seed a backlog so the offline banner shows "7 records pending sync"
  // exactly as in the design reference on first launch.
  const queued = await db.syncQueue.count();
  if (queued === 0) {
    const now = Date.now();
    const backlog = [
      'ANC visit · Rahima Begum',
      'ANC visit · Morjina Begum',
      'Child assessment · Abdullah',
      'Registration · Tania Akter',
      'PNC visit · Nasima Akter',
      'Danger sign flag · Abdul Karim',
      'Home visit · Jamal Hossain',
    ];
    await db.syncQueue.bulkAdd(
      backlog.map((label, i) => ({
        kind: 'visit' as const,
        refId: `seed-${i}`,
        label,
        createdAt: now - (backlog.length - i) * 3600_000,
      })),
    );
  }
}
