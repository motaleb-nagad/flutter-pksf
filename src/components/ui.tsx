/* Small shared presentational primitives used across both surfaces. */
import type { CSSProperties, ReactNode } from 'react';
import { RISK } from '../domain/risk';
import type { RiskLevel } from '../domain/types';
import { initials as toInitials } from '../domain/format';

/** Risk pill. `variant="solid"` fills with the risk color (used on profile headers). */
export function RiskBadge({
  level,
  text,
  variant = 'tint',
}: {
  level: RiskLevel;
  text?: 'label' | 'bn';
  variant?: 'tint' | 'solid';
}) {
  const r = RISK[level];
  const label = text === 'bn' ? r.bn : r.label;
  const style: CSSProperties =
    variant === 'solid'
      ? { color: '#fff', background: r.color }
      : { color: r.color, background: r.bg };
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: '3px 9px',
        borderRadius: 'var(--r-pill)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {label}
    </span>
  );
}

/** Round initials avatar tinted by risk level. */
export function Avatar({
  name,
  level,
  size = 42,
  neutral = false,
}: {
  name: string;
  level?: RiskLevel;
  size?: number;
  neutral?: boolean;
}) {
  const r = level ? RISK[level] : RISK.low;
  const bg = neutral ? '#E0EFEA' : r.bg;
  const color = neutral ? '#0E7C66' : r.color;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size * 0.34,
        flexShrink: 0,
      }}
    >
      {toInitials(name)}
    </div>
  );
}

/** Uppercase section eyebrow with an optional Bangla suffix. */
export function SectionLabel({
  children,
  color = 'var(--c-brand)',
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '.06em',
        color,
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** White hairline card. */
export function Card({
  children,
  style,
  onClick,
}: {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--c-card)',
        border: '1px solid var(--c-border-1)',
        borderRadius: 'var(--r-card)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** A label rendered bilingually: English with a Bangla secondary line. */
export function Bilingual({
  en,
  bn,
  enStyle,
  bnStyle,
}: {
  en: ReactNode;
  bn: ReactNode;
  enStyle?: CSSProperties;
  bnStyle?: CSSProperties;
}) {
  return (
    <>
      <div style={enStyle}>{en}</div>
      <div style={{ color: 'var(--c-text-muted)', fontSize: 11, ...bnStyle }}>{bn}</div>
    </>
  );
}
