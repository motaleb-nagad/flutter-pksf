import { useAppStore, type PortalSection } from '../store/useAppStore';
import { Icon, type IconName } from '../components/Icon';
import { CURRENT_SUPERVISOR } from '../domain/seed';

const NAV: { key: PortalSection; icon: IconName; label: string }[] = [
  { key: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  { key: 'beneficiaries', icon: 'people', label: 'Beneficiaries' },
  { key: 'indicators', icon: 'gauge', label: 'Indicators' },
  { key: 'workers', icon: 'worker', label: 'Field officers' },
];

const DISABLED: { icon: IconName; label: string }[] = [
  { icon: 'reports', label: 'Reports' },
  { icon: 'settings', label: 'Settings' },
];

export function Sidebar() {
  const section = useAppStore((s) => s.portalSection);
  const setSection = useAppStore((s) => s.setSection);
  const adminLogout = useAppStore((s) => s.adminLogout);

  return (
    <div
      style={{
        width: 212,
        flexShrink: 0,
        background: 'var(--c-brand-deep)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '18px 12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 8px 18px' }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: '#fff',
            color: 'var(--c-brand-deep)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="cross" size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.1 }}>মা ও শিশু</div>
          <div style={{ fontSize: 10, opacity: 0.7 }}>MCH Surveillance</div>
        </div>
      </div>

      {NAV.map((n) => {
        const active = section === n.key;
        return (
          <button
            key={n.key}
            onClick={() => setSection(n.key)}
            className="btn-reset"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              padding: '10px 12px',
              borderRadius: 9,
              marginBottom: 3,
              background: active ? 'rgba(255,255,255,0.16)' : 'transparent',
              color: active ? '#fff' : 'rgba(255,255,255,0.62)',
            }}
          >
            <Icon name={n.icon} size={17} color={active ? '#fff' : 'rgba(255,255,255,0.62)'} />
            {n.label}
          </button>
        );
      })}
      {DISABLED.map((n) => (
        <div
          key={n.label}
          title="Coming soon"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13,
            fontWeight: 500,
            padding: '10px 12px',
            borderRadius: 9,
            marginBottom: 3,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          <Icon name={n.icon} size={17} color="rgba(255,255,255,0.5)" />
          {n.label}
        </div>
      ))}

      <div
        style={{
          marginTop: 'auto',
          padding: '12px 8px 0',
          borderTop: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ flex: 1, fontSize: 11, opacity: 0.7 }}>
            {CURRENT_SUPERVISOR.upazila}
            <div style={{ marginTop: 2 }}>{CURRENT_SUPERVISOR.name} · Supervisor</div>
          </div>
          <button
            onClick={adminLogout}
            title="Log out"
            className="btn-reset"
            style={{
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.14)',
              color: '#fff',
              fontSize: 11.5,
              fontWeight: 600,
              padding: '7px 11px',
              borderRadius: 8,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Icon name="power" size={13} color="#fff" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
