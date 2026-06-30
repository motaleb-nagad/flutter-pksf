import type { ReactNode } from 'react';
import { Icon } from '../components/Icon';

/** Green app screen header with a back chevron + bilingual title. */
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  onBack: () => void;
  right?: ReactNode;
}) {
  return (
    <div style={{ background: 'var(--c-brand)', color: '#fff', padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onBack}
          aria-label="Back"
          className="btn-reset"
          style={{ cursor: 'pointer', color: '#fff', display: 'flex' }}
        >
          <Icon name="chevron-left" size={22} color="#fff" />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15.5 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11.5, opacity: 0.85 }}>{subtitle}</div>}
        </div>
        {right}
      </div>
    </div>
  );
}
