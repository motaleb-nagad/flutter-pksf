import { useState } from 'react';
import { flushSyncQueue } from '../data/repository';
import { useAppStore } from '../store/useAppStore';

/** Drives the manual "Sync" action: flush the offline queue + mark synced. */
export function useSync() {
  const markSynced = useAppStore((s) => s.markSynced);
  const [syncing, setSyncing] = useState(false);

  async function sync() {
    if (syncing) return;
    setSyncing(true);
    try {
      // Simulate a network round-trip; real impl would POST batched records.
      await new Promise((r) => setTimeout(r, 700));
      await flushSyncQueue();
      markSynced();
    } finally {
      setSyncing(false);
    }
  }

  return { sync, syncing };
}
