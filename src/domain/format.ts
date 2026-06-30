import type { Beneficiary, Bilingual } from './types';

/** First-two-initials from a person's name, e.g. "Rahima Begum" → "RB". */
export function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Bilingual one-liner describing a beneficiary's type + key attribute. */
export function typeLine(b: Beneficiary): Bilingual {
  switch (b.type) {
    case 'anc':
      return { en: `Pregnant · ${b.weeks} wk`, bn: 'গর্ভবতী মা' };
    case 'pnc':
      return { en: `Postnatal · Day ${b.day}`, bn: 'প্রসব-পরবর্তী' };
    case 'adolescent':
      return { en: `Adolescent · ${b.age} yr`, bn: 'কিশোর-কিশোরী' };
    case 'elderly':
      return { en: `Elderly · ${b.age} yr`, bn: 'প্রবীণ' };
    case 'disabled':
      return { en: 'Person with disability', bn: 'প্রতিবন্ধী' };
    case 'child':
    default:
      return { en: `Child · ${b.months} mo`, bn: 'শিশু' };
  }
}

/**
 * Coverage / prevalence color.
 * For coverage indicators higher is better; for "burden" indicators (e.g. wasting,
 * caesarean rate, unmet need) higher is worse, so the scale inverts.
 */
export function covColor(v: number, burden = false): string {
  if (burden) return v >= 25 ? '#C0492E' : v >= 12 ? '#B5792A' : '#0E7C66';
  return v >= 85 ? '#0E7C66' : v >= 60 ? '#B5792A' : '#C0492E';
}

/** Username generator used when onboarding a field officer (e.g. "sahida.cb06"). */
export function unionCode(u: string): string {
  return u
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toLowerCase();
}

export function genUsername(name: string, union: string, n: number): string {
  const first = (name.trim().split(' ')[0] || 'worker')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  return `${first}.${unionCode(union)}${String(n).padStart(2, '0')}`;
}

export function genPassword(): string {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let p = '';
  for (let i = 0; i < 4; i++) p += c[Math.floor(Math.random() * c.length)];
  return `Mch-${p}`;
}
