/* Sample data — Char Bhola Union, Bhola Sadar Upazila (from the design handoff). */
import type { Beneficiary, Worker } from './types';

export const SEED_BENEFICIARIES: Beneficiary[] = [
  { id: 'b1', name: 'Rahima Begum', bn: 'রহিমা বেগম', age: 19, type: 'anc', weeks: 32, village: 'Char Bhola', code: 'ANC-2451', anc: 3, edd: '12 Aug 2026', risk: 'high', reason: 'Raised BP, age under 20', next: 'Due today' },
  { id: 'b3', name: 'Morjina Begum', bn: 'মর্জিনা বেগম', age: 34, type: 'anc', weeks: 28, village: 'Char Bhola', code: 'ANC-2439', anc: 4, edd: '02 Sep 2026', risk: 'medium', reason: 'Anaemia (Hb 9.2), age 34', next: 'Due today' },
  { id: 'b4', name: 'Abdullah', bn: 'আব্দুল্লাহ', months: 9, type: 'child', village: 'Char Bhola', code: 'CH-1182', risk: 'high', reason: 'MUAC 11.2 cm — SAM', muac: 11.2, next: 'Due today' },
  { id: 'b2', name: 'Shefali Khatun', bn: 'শেফালী খাতুন', age: 26, type: 'anc', weeks: 18, village: 'Madhupur', code: 'ANC-2447', anc: 2, edd: '30 Oct 2026', risk: 'low', next: '10 Jul' },
  { id: 'b5', name: 'Nasima Akter', bn: 'নাসিমা আক্তার', age: 22, type: 'pnc', village: 'Madhupur', code: 'PNC-0912', risk: 'low', day: 3, next: '12 Jul' },
  { id: 'b6', name: 'Fatema', bn: 'ফাতেমা', months: 14, type: 'child', village: 'Uttar Para', code: 'CH-1175', risk: 'low', next: '18 Jul' },
  { id: 'b7', name: 'Tania Akter', bn: 'তানিয়া আক্তার', age: 14, type: 'adolescent', village: 'Char Bhola', code: 'ADO-0571', risk: 'medium', reason: 'Anaemia screening due', next: 'Due today' },
  { id: 'b8', name: 'Abdul Karim', bn: 'আব্দুল করিম', age: 68, type: 'elderly', village: 'Madhupur', code: 'ELD-0233', risk: 'high', reason: 'Hypertension — uncontrolled BP', next: 'Due today' },
  { id: 'b9', name: 'Jamal Hossain', bn: 'জামাল হোসেন', age: 31, type: 'disabled', village: 'Uttar Para', code: 'PWD-0118', risk: 'medium', reason: 'Mobility impairment — home visit', next: '15 Jul' },
];

export const SEED_WORKERS: Worker[] = [
  { id: 'w1', name: 'Rokeya Sultana', role: 'FWA', union: 'Char Bhola', assigned: 142, high: 6, visits: 118, cov: 71, lastSync: '2 days ago', status: 'offline' },
  { id: 'w2', name: 'Shahnaz Pervin', role: 'FWA', union: 'Madhupur', assigned: 128, high: 3, visits: 104, cov: 78, lastSync: '09:05 today', status: 'online' },
  { id: 'w3', name: 'Anwara Khatun', role: 'FWV', union: 'Uttar Para', assigned: 96, high: 2, visits: 71, cov: 64, lastSync: '08:40 today', status: 'online' },
  { id: 'w4', name: 'Hasna Hena', role: 'CHCP', union: 'Char Bhola', assigned: 110, high: 4, visits: 92, cov: 58, lastSync: '1 day ago', status: 'offline' },
  { id: 'w5', name: 'Mukti Rani', role: 'FWA', union: 'Dakshin', assigned: 134, high: 5, visits: 121, cov: 83, lastSync: '09:11 today', status: 'online' },
];

/** The logged-in field officer (mobile app). */
export const CURRENT_OFFICER = {
  name: 'রোকেয়া সুলতানা',
  nameEn: 'Rokeya Sultana',
  initials: 'RS',
  role: 'FWA',
  union: 'Char Bhola Union',
  username: 'rokeya.cb01',
};

/** The logged-in supervisor (portal). */
export const CURRENT_SUPERVISOR = {
  name: 'Dr. S. Rahman',
  upazila: 'Bhola Sadar Upazila',
  username: 's.rahman',
  scope: 'Bhola Sadar · 6 unions · 42 field officers',
};

export const UNIONS = ['Char Bhola', 'Madhupur', 'Uttar Para', 'Dakshin', 'Purba Para'];
export const ROLES = ['FWA', 'FWV', 'CHCP', 'HA'] as const;
