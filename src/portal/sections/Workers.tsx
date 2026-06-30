import { useState } from 'react';
import { Card } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { useWorkers } from '../../data/hooks';
import { initials, covColor } from '../../domain/format';
import { OnboardModal } from '../OnboardModal';

const COLS = '1.9fr 0.8fr 1fr 1.1fr 0.9fr 1.2fr 1fr 0.9fr';

export function Workers() {
  const workers = useWorkers();
  const [onboarding, setOnboarding] = useState(false);
  const totalVisits = workers.reduce((a, w) => a + w.visits, 0);

  return (
    <div style={{ padding: '22px 24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 14 }}>
          <Card style={{ padding: '13px 18px', border: '1px solid var(--c-border-2)' }}>
            <div style={{ fontSize: 12, color: 'var(--c-text-2)' }}>Active officers</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 3 }}>{workers.length}</div>
          </Card>
          <Card style={{ padding: '13px 18px', border: '1px solid var(--c-border-2)' }}>
            <div style={{ fontSize: 12, color: 'var(--c-text-2)' }}>Visits this month</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 3 }}>{totalVisits}</div>
          </Card>
        </div>
        <button
          onClick={() => setOnboarding(true)}
          className="btn-reset"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            cursor: 'pointer',
            fontSize: 13.5,
            fontWeight: 600,
            background: 'var(--c-brand)',
            color: '#fff',
            padding: '11px 18px',
            borderRadius: 10,
          }}
        >
          <Icon name="plus" size={16} color="#fff" /> Onboard field officer
        </button>
      </div>

      <Card style={{ padding: 18, border: '1px solid var(--c-border-2)' }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Field officers · মাঠকর্মী</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: COLS,
            gap: 10,
            fontSize: 11,
            color: 'var(--c-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '.04em',
            padding: '0 6px 10px',
            borderBottom: '1px solid #EFEBE2',
          }}
        >
          <div>Officer</div>
          <div>Role</div>
          <div>Union</div>
          <div>Assigned</div>
          <div>Visits</div>
          <div>ANC4+ coverage</div>
          <div>Last sync</div>
          <div>Status</div>
        </div>
        {workers.map((w) => {
          const online = w.status === 'online';
          const cc = covColor(w.cov);
          return (
            <div
              key={w.id}
              style={{
                display: 'grid',
                gridTemplateColumns: COLS,
                gap: 10,
                fontSize: 13,
                alignItems: 'center',
                padding: '13px 6px',
                borderBottom: '1px solid #F3F0E9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: '#E0EFEA',
                    color: 'var(--c-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {initials(w.name)}
                </span>
                <span style={{ fontWeight: 500 }}>{w.name}</span>
              </div>
              <div style={{ color: 'var(--c-text-2)' }}>{w.role}</div>
              <div style={{ color: 'var(--c-text-2)' }}>{w.union}</div>
              <div style={{ color: 'var(--c-text-2)' }}>
                {w.assigned} <span style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>({w.high} HR)</span>
              </div>
              <div className="mono" style={{ color: 'var(--c-text-soft)' }}>
                {w.visits}
              </div>
              <div>
                <div className="mono" style={{ fontSize: 11.5, fontWeight: 600, color: cc, marginBottom: 3 }}>
                  {w.cov}%
                </div>
                <div style={{ height: 6, borderRadius: 3, background: '#EFEBE2' }}>
                  <div style={{ height: 6, borderRadius: 3, width: `${w.cov}%`, background: cc }} />
                </div>
              </div>
              <div style={{ color: 'var(--c-text-2)', fontSize: 12 }}>{w.lastSync}</div>
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: online ? 'var(--c-brand)' : 'var(--c-risk-medium)',
                    background: online ? '#E0EFEA' : '#F5EAD6',
                    padding: '3px 9px',
                    borderRadius: 20,
                  }}
                >
                  {online ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          );
        })}
      </Card>

      {onboarding && <OnboardModal onClose={() => setOnboarding(false)} />}
    </div>
  );
}
