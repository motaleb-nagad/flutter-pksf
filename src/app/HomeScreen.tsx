import { useAppStore } from '../store/useAppStore';
import { useBeneficiaries, usePendingSyncCount } from '../data/hooks';
import { Avatar, Card, RiskBadge } from '../components/ui';
import { Icon } from '../components/Icon';
import { CURRENT_OFFICER } from '../domain/seed';
import { typeLine } from '../domain/format';
import { useSync } from './useSync';

export function HomeScreen() {
  const all = useBeneficiaries();
  const pending = usePendingSyncCount();
  const online = useAppStore((s) => s.online);
  const lastSynced = useAppStore((s) => s.lastSynced);
  const go = useAppStore((s) => s.go);
  const setFilter = useAppStore((s) => s.setFilter);
  const openProfile = useAppStore((s) => s.openProfile);
  const appLogout = useAppStore((s) => s.appLogout);
  const { sync, syncing } = useSync();

  const dueToday = all.filter((b) => b.next === 'Due today');
  const highCount = all.filter((b) => b.risk === 'high').length;

  return (
    <div className="sc-fade">
      {/* Green header */}
      <div style={{ background: 'var(--c-brand)', color: '#fff', padding: '16px 16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            {CURRENT_OFFICER.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 15.5 }}>{CURRENT_OFFICER.name}</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              {CURRENT_OFFICER.role} · {CURRENT_OFFICER.union}
            </div>
          </div>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Icon name="bell" size={16} color="#fff" />
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 7,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--c-warning-dot)',
              }}
            />
          </div>
          <button
            onClick={appLogout}
            title="Log out · প্রস্থান"
            className="btn-reset"
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.14)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Icon name="power" size={16} color="#fff" />
          </button>
        </div>

        {/* Offline / sync banner */}
        <div
          style={{
            marginTop: 14,
            background: 'rgba(0,0,0,0.16)',
            borderRadius: 11,
            padding: '11px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: online ? '#7BE0A3' : 'var(--c-warning-dot)',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.35 }}>
            <b>{online ? 'Online' : 'Offline'}</b> · {online ? 'অনলাইন' : 'অফলাইন'} ·{' '}
            {pending} record{pending === 1 ? '' : 's'} pending sync
            <div style={{ opacity: 0.75, fontSize: 11 }}>Last synced {lastSynced}</div>
          </div>
          <button
            onClick={sync}
            disabled={syncing || pending === 0}
            className="btn-reset"
            style={{
              background: '#fff',
              color: 'var(--c-brand)',
              fontWeight: 600,
              fontSize: 12.5,
              padding: '7px 12px',
              borderRadius: 8,
              cursor: syncing || pending === 0 ? 'default' : 'pointer',
              opacity: pending === 0 ? 0.6 : 1,
            }}
          >
            {syncing ? 'Syncing…' : 'Sync'}
          </button>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 11 }}>
          <Card style={{ flex: 1, padding: 13 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--c-brand)' }}>
              {dueToday.length}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--c-text-2)', marginTop: 2 }}>
              Visits due today
              <div style={{ fontSize: 11 }}>আজকের পরিদর্শন</div>
            </div>
          </Card>
          <Card style={{ flex: 1, padding: 13 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--c-risk-high)' }}>
              {highCount}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--c-text-2)', marginTop: 2 }}>
              High-risk cases
              <div style={{ fontSize: 11 }}>উচ্চ ঝুঁকি</div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 11, marginTop: 13 }}>
          <button
            onClick={() => go('register', 'add')}
            className="btn-reset"
            style={{
              flex: 1,
              cursor: 'pointer',
              background: 'var(--c-brand)',
              color: '#fff',
              borderRadius: 12,
              padding: '14px 12px',
              textAlign: 'left',
            }}
          >
            <Icon name="plus" size={20} color="#fff" />
            <div style={{ fontWeight: 600, fontSize: 13.5, marginTop: 5 }}>New registration</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>নতুন নিবন্ধন</div>
          </button>
          <button
            onClick={() => setFilter('all')}
            className="btn-reset"
            style={{
              flex: 1,
              cursor: 'pointer',
              border: '1px solid var(--c-border-4)',
              background: '#fff',
              color: 'var(--c-text)',
              borderRadius: 12,
              padding: '14px 12px',
              textAlign: 'left',
            }}
          >
            <Icon name="list" size={20} />
            <div style={{ fontWeight: 600, fontSize: 13.5, marginTop: 5 }}>All beneficiaries</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-2)' }}>উপকারভোগী</div>
          </button>
        </div>

        {/* Due today */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '20px 2px 10px',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14 }}>
            Due today <span style={{ color: 'var(--c-text-2)', fontWeight: 400 }}>· আজকের কাজ</span>
          </div>
          <button
            onClick={() => setFilter('all')}
            className="btn-reset"
            style={{ cursor: 'pointer', fontSize: 12.5, color: 'var(--c-brand)', fontWeight: 600 }}
          >
            See all
          </button>
        </div>

        {dueToday.map((b) => {
          const t = typeLine(b);
          return (
            <Card
              key={b.id}
              onClick={() => openProfile(b.id)}
              style={{
                cursor: 'pointer',
                borderLeft: `4px solid var(--c-risk-${b.risk})`,
                padding: 12,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Avatar name={b.name} level={b.risk} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: 'var(--c-text-2)' }}>
                  {t.en} · {b.village}
                </div>
              </div>
              <RiskBadge level={b.risk} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
