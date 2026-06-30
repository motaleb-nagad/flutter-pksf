import { useAppStore, type PortalSection } from '../store/useAppStore';
import { CURRENT_SUPERVISOR } from '../domain/seed';

const TITLES: Record<PortalSection, string> = {
  dashboard: 'Programme Dashboard',
  beneficiaries: 'Beneficiaries',
  workers: 'Field Officers',
  indicators: 'Indicators · WHO framework',
};

export function TopBar() {
  const section = useAppStore((s) => s.portalSection);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid var(--c-border-3)',
        background: 'var(--c-portal-header-bg)',
        flexShrink: 0,
      }}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{TITLES[section]}</div>
        <div style={{ fontSize: 12, color: 'var(--c-text-2)' }}>{CURRENT_SUPERVISOR.scope}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            fontSize: 12,
            color: 'var(--c-brand)',
            background: '#E0EFEA',
            padding: '6px 11px',
            borderRadius: 20,
          }}
        >
          ● Synced · updated 09:12
        </span>
        <span
          style={{
            fontSize: 12,
            color: '#5C594F',
            background: '#fff',
            border: '1px solid var(--c-border-3)',
            padding: '6px 11px',
            borderRadius: 20,
          }}
        >
          Jan – Jun 2026 ▾
        </span>
      </div>
    </div>
  );
}
