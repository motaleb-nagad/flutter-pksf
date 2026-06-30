import { Card, Avatar, RiskBadge } from '../../components/ui';
import { useBeneficiaries } from '../../data/hooks';
import { typeLine } from '../../domain/format';

const COLS = '1.8fr 1.2fr 1fr 1fr 0.8fr 1fr';

export function Beneficiaries() {
  const all = useBeneficiaries();
  return (
    <div style={{ padding: '22px 24px' }}>
      <Card style={{ padding: 18, border: '1px solid var(--c-border-2)' }}>
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
          <div>Name</div>
          <div>Type</div>
          <div>Village</div>
          <div>ID</div>
          <div>Risk</div>
          <div>Next visit</div>
        </div>
        {all.map((c) => {
          const t = typeLine(c);
          return (
            <div
              key={c.id}
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
                <Avatar name={c.name} level={c.risk} size={34} />
                <div>
                  <div style={{ fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>{c.bn}</div>
                </div>
              </div>
              <div style={{ color: 'var(--c-text-2)' }}>{t.en}</div>
              <div style={{ color: 'var(--c-text-2)' }}>{c.village}</div>
              <div className="mono" style={{ fontSize: 11.5, color: 'var(--c-text-2)' }}>
                {c.code}
              </div>
              <div>
                <RiskBadge level={c.risk} />
              </div>
              <div style={{ color: 'var(--c-text-2)' }}>{c.next}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
