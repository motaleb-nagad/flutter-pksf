/* React hooks over the offline DB. */
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import type { Beneficiary, Worker } from '../domain/types';

export function useBeneficiaries(): Beneficiary[] {
  return useLiveQuery(() => db.beneficiaries.toArray(), [], []) ?? [];
}

export function useBeneficiary(id: string): Beneficiary | undefined {
  return useLiveQuery(() => db.beneficiaries.get(id), [id]);
}

export function useWorkers(): Worker[] {
  return useLiveQuery(() => db.workers.toArray(), [], []) ?? [];
}

/** Number of records waiting to sync (drives the offline banner badge). */
export function usePendingSyncCount(): number {
  return useLiveQuery(() => db.syncQueue.count(), [], 0) ?? 0;
}
