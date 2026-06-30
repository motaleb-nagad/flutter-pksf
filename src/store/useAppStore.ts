/*
 * UI / session state (zustand). Domain data lives in the offline DB (Dexie);
 * this store only holds navigation + auth + connectivity flags.
 */
import { create } from 'zustand';
import type { BeneficiaryType, RiskLevel } from '../domain/types';

export type View = 'app' | 'portal';
export type AppScreen = 'home' | 'list' | 'register' | 'visit' | 'child' | 'profile';
export type AppTab = 'home' | 'cases' | 'add' | 'alerts';
export type PortalSection = 'dashboard' | 'beneficiaries' | 'indicators' | 'workers';
export type ListFilter = 'all' | BeneficiaryType | 'pregnant' | 'high';

interface AppState {
  view: View;

  // mobile app
  loggedIn: boolean;
  screen: AppScreen;
  tab: AppTab;
  listFilter: ListFilter;
  selectedId: string;
  profileTab: 'overview' | 'history';

  // portal
  adminLoggedIn: boolean;
  portalSection: PortalSection;

  // connectivity / sync (offline-first)
  online: boolean;
  lastSynced: string;

  setView: (view: View) => void;

  appLogin: () => void;
  appLogout: () => void;
  go: (screen: AppScreen, tab?: AppTab) => void;
  openProfile: (id: string) => void;
  setFilter: (filter: ListFilter) => void;
  setProfileTab: (t: 'overview' | 'history') => void;

  adminLogin: () => void;
  adminLogout: () => void;
  setSection: (section: PortalSection) => void;

  setOnline: (online: boolean) => void;
  markSynced: () => void;
}

function nowLabel(): string {
  return new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const useAppStore = create<AppState>((set) => ({
  view: 'app',

  loggedIn: false,
  screen: 'home',
  tab: 'home',
  listFilter: 'all',
  selectedId: 'b1',
  profileTab: 'overview',

  adminLoggedIn: false,
  portalSection: 'dashboard',

  online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  lastSynced: '2 days ago · 14:20',

  setView: (view) => set({ view }),

  appLogin: () => set({ loggedIn: true, screen: 'home', tab: 'home' }),
  appLogout: () => set({ loggedIn: false }),
  go: (screen, tab) => set((s) => ({ screen, tab: tab ?? s.tab })),
  openProfile: (id) => set({ selectedId: id, screen: 'profile', tab: 'cases' }),
  setFilter: (filter) =>
    set({
      listFilter: filter,
      screen: 'list',
      tab: filter === 'high' ? 'alerts' : 'cases',
    }),
  setProfileTab: (profileTab) => set({ profileTab }),

  adminLogin: () => set({ adminLoggedIn: true, portalSection: 'dashboard' }),
  adminLogout: () => set({ adminLoggedIn: false }),
  setSection: (portalSection) => set({ portalSection }),

  setOnline: (online) => set({ online }),
  markSynced: () => set({ lastSynced: `just now · ${nowLabel()}` }),
}));

/** Helper used by list/portal filters. */
export function filterBeneficiaries<
  T extends { type: BeneficiaryType; risk: RiskLevel },
>(items: T[], filter: ListFilter): T[] {
  switch (filter) {
    case 'all':
      return items;
    case 'pregnant':
      return items.filter((b) => b.type === 'anc' || b.type === 'pnc');
    case 'high':
      return items.filter((b) => b.risk === 'high');
    case 'child':
    case 'adolescent':
    case 'elderly':
    case 'disabled':
    case 'anc':
    case 'pnc':
      return items.filter((b) => b.type === filter);
    default:
      return items;
  }
}
