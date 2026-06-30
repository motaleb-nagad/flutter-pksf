import { useAppStore } from '../store/useAppStore';
import { Icon, type IconName } from '../components/Icon';

export function BottomNav() {
  const tab = useAppStore((s) => s.tab);
  const go = useAppStore((s) => s.go);
  const setFilter = useAppStore((s) => s.setFilter);
  const setView = useAppStore((s) => s.setView);

  const item = (
    key: string,
    icon: IconName,
    label: string,
    active: boolean,
    onClick: () => void,
  ) => (
    <button
      key={key}
      onClick={onClick}
      className="btn-reset"
      style={{
        flex: 1,
        cursor: 'pointer',
        padding: '9px 0 11px',
        color: active ? 'var(--c-brand)' : 'var(--c-text-muted)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <Icon name={icon} size={20} />
      <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>
    </button>
  );

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid #E5E1D8',
        background: '#fff',
      }}
    >
      {item('home', 'home', 'Home', tab === 'home', () => go('home', 'home'))}
      {item('cases', 'list', 'তালিকা', tab === 'cases', () => setFilter('all'))}
      <button
        onClick={() => go('register', 'add')}
        aria-label="New registration"
        className="btn-reset"
        style={{ flex: 1, cursor: 'pointer', padding: '5px 0' }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            margin: '0 auto',
            borderRadius: '50%',
            background: 'var(--c-brand)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="plus" size={22} color="#fff" />
        </div>
      </button>
      {item('alerts', 'alert', 'সতর্কতা', tab === 'alerts', () => setFilter('high'))}
      {item('portal', 'monitor', 'Portal', false, () => setView('portal'))}
    </nav>
  );
}
