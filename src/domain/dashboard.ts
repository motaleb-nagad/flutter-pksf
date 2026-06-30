/* Aggregate programme figures for the supervisor dashboard. */
import { covColor } from './format';

export interface Kpi {
  en: string;
  bn: string;
  value: string;
  sub: string;
  good: boolean;
}

export const KPIS: Kpi[] = [
  { en: 'Registered pregnancies', bn: 'নিবন্ধিত গর্ভবতী', value: '1,284', sub: '+96 this month', good: true },
  { en: 'ANC 4+ coverage', bn: 'এএনসি ৪+', value: '71%', sub: 'Target 90%', good: false },
  { en: 'Skilled birth attendance', bn: 'দক্ষ ধাত্রী', value: '63%', sub: '+4 pts vs Q1', good: true },
  { en: 'PNC within 48 hr', bn: 'পিএনসি ৪৮ ঘণ্টা', value: '58%', sub: 'Target 80%', good: false },
  { en: 'Fully immunised <1 yr', bn: 'সম্পূর্ণ টিকা', value: '84%', sub: '+2 pts', good: true },
  { en: 'Active SAM cases', bn: 'সক্রিয় তীব্র অপুষ্টি', value: '37', sub: '29 in treatment', good: false },
];

export const ANC_TREND = [
  { label: 'Jan', value: 58 },
  { label: 'Feb', value: 61 },
  { label: 'Mar', value: 64 },
  { label: 'Apr', value: 66 },
  { label: 'May', value: 69 },
  { label: 'Jun', value: 71 },
];

export const ANTIGENS = [
  { label: 'BCG', value: 97 },
  { label: 'Penta3', value: 88 },
  { label: 'PCV3', value: 86 },
  { label: 'OPV3', value: 87 },
  { label: 'IPV', value: 79 },
  { label: 'MR1', value: 85 },
  { label: 'MR2', value: 72 },
].map((a) => ({ ...a, color: covColor(a.value) }));

export const NUTRITION_BANDS = [
  { label: 'Normal', value: 81, color: '#0E7C66' },
  { label: 'MAM', value: 13, color: '#B5792A' },
  { label: 'SAM', value: 6, color: '#C0492E' },
];

export const RISK_DISTRIBUTION = [
  { label: 'Low', value: 64, color: '#0E7C66' },
  { label: 'Medium', value: 26, color: '#B5792A' },
  { label: 'High', value: 10, color: '#C0492E' },
];
