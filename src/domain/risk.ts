/*
 * Centralized risk classification.
 *
 * The README is explicit: "Risk classification (RISK map) recolors avatars,
 * left borders, badges everywhere — centralize it." Every surface (app + portal)
 * imports from here so colors and thresholds never drift.
 */
import type { AncVisit, RiskLevel } from './types';

export interface RiskStyle {
  color: string;
  bg: string;
  label: string;
  bn: string;
}

export const RISK: Record<RiskLevel, RiskStyle> = {
  high: { color: '#C0492E', bg: '#F7E4DE', label: 'High risk', bn: 'উচ্চ ঝুঁকি' },
  medium: { color: '#B5792A', bg: '#F5EAD6', label: 'Medium risk', bn: 'মাঝারি ঝুঁকি' },
  low: { color: '#0E7C66', bg: '#E0EFEA', label: 'Low risk', bn: 'কম ঝুঁকি' },
};

const ORDER: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2 };

/** Returns the more severe of two risk levels. */
export function maxRisk(a: RiskLevel, b: RiskLevel): RiskLevel {
  return ORDER[a] >= ORDER[b] ? a : b;
}

const DANGER_LABELS: Record<keyof AncVisit['danger'], string> = {
  headache: 'Severe headache',
  blurred: 'Blurred vision',
  swelling: 'Swelling of face / hands',
  bleeding: 'Vaginal bleeding',
  convulsions: 'Convulsions',
  fever: 'High fever',
  fetal: 'Reduced fetal movement',
  abdo: 'Severe abdominal pain',
  breathing: 'Difficult breathing',
};

export interface ComputedRisk extends RiskStyle {
  level: RiskLevel;
  reasons: string[];
}

/**
 * Auto-classify an ANC visit from vitals + danger signs.
 * Any danger sign → high. BP / Hb / FHR thresholds bump the level.
 */
export function computeAncRisk(v: AncVisit): ComputedRisk {
  const reasons: string[] = [];
  let level: RiskLevel = 'low';
  const bump = (l: RiskLevel) => {
    level = maxRisk(level, l);
  };

  (Object.keys(v.danger) as (keyof AncVisit['danger'])[]).forEach((k) => {
    if (v.danger[k]) {
      reasons.push(DANGER_LABELS[k]);
      bump('high');
    }
  });

  if (v.sbp >= 140 || v.dbp >= 90) {
    reasons.push(`Raised BP ${v.sbp}/${v.dbp} mmHg (pre-eclampsia risk)`);
    bump('high');
  } else if (v.sbp >= 130 || v.dbp >= 85) {
    reasons.push(`Borderline BP ${v.sbp}/${v.dbp}`);
    bump('medium');
  }

  if (v.hb < 7) {
    reasons.push(`Severe anaemia · Hb ${v.hb} g/dL`);
    bump('high');
  } else if (v.hb < 11) {
    reasons.push(`Anaemia · Hb ${v.hb} g/dL`);
    bump('medium');
  }

  if (v.fhr < 120 || v.fhr > 160) {
    reasons.push(`Abnormal fetal heart rate ${v.fhr} bpm`);
    bump('high');
  }

  return { level, reasons, ...RISK[level] };
}
