/*
 * Repository — the only module that mutates the local DB. Every write also pushes
 * a record onto the sync queue so the offline → online flush is centralized.
 */
import { db } from './db';
import type {
  Beneficiary,
  ChildAssessment,
  Worker,
} from '../domain/types';

async function enqueue(
  kind: 'visit' | 'registration' | 'child-assessment' | 'worker',
  refId: string,
  label: string,
): Promise<void> {
  await db.syncQueue.add({ kind, refId, label, createdAt: Date.now() });
}

export async function addBeneficiary(b: Beneficiary): Promise<void> {
  await db.beneficiaries.put(b);
  await enqueue('registration', b.id, `Registered ${b.name}`);
}

/** Record an ANC visit outcome against a beneficiary (risk + next visit). */
export async function recordAncVisit(
  id: string,
  patch: Pick<Beneficiary, 'risk' | 'reason' | 'next'> & { anc?: number },
): Promise<void> {
  await db.beneficiaries.update(id, patch);
  await enqueue('visit', id, `ANC visit for ${id}`);
}

export async function recordChildAssessment(
  id: string,
  assessment: ChildAssessment,
  patch: Pick<Beneficiary, 'risk' | 'reason' | 'muac'>,
): Promise<void> {
  await db.beneficiaries.update(id, patch);
  await enqueue('child-assessment', id, `Child assessment for ${id} (MUAC ${assessment.muac})`);
}

export async function addWorker(w: Worker): Promise<void> {
  await db.workers.put(w);
  await enqueue('worker', w.id, `Onboarded ${w.name}`);
}

/**
 * Flush the sync queue. With no real backend this just clears the queue and marks
 * the device as synced — the real implementation would POST batched records and
 * only clear those the server acknowledged.
 */
export async function flushSyncQueue(): Promise<number> {
  const items = await db.syncQueue.toArray();
  await db.syncQueue.clear();
  return items.length;
}
