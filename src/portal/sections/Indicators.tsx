import { Card } from '../../components/ui';
import { indicatorGroups } from '../../domain/indicators';

export function Indicators() {
  const groups = indicatorGroups();
  return (
    <div style={{ padding: '22px 24px' }}>
      {/* Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 18,
          fontSize: 12,
          color: 'var(--c-text-2)',
          flexWrap: 'wrap',
        }}
      >
        <LegendDot color="#0E7C66" label="≥ 85% on target" />
        <LegendDot color="#B5792A" label="60–84% gap" />
        <LegendDot color="#C0492E" label="< 60% / high burden" />
        <span style={{ marginLeft: 'auto', color: 'var(--c-text-muted)' }}>
          WHO &amp; Bangladesh MCH framework
        </span>
      </div>

      <div style={{ columns: 2, columnGap: 16 }}>
        {groups.map((g) => (
          <Card
            key={g.group}
            style={{
              breakInside: 'avoid',
              border: '1px solid var(--c-border-2)',
              padding: '16px 18px',
              marginBottom: 16,
              borderRadius: 14,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>{g.group}</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-muted)', marginBottom: 13 }}>{g.bn}</div>
            {g.items.map((i) => (
              <div key={i.name} style={{ marginBottom: 11 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    fontSize: 12,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: 'var(--c-text-soft)' }}>{i.name}</span>
                  <span className="mono" style={{ fontWeight: 600, color: i.color }}>
                    {i.valueLabel}
                  </span>
                </div>
                <div style={{ height: 7, borderRadius: 4, background: '#EFEBE2' }}>
                  <div style={{ height: 7, borderRadius: 4, width: `${i.value}%`, background: i.color }} />
                </div>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 11, height: 11, borderRadius: 3, background: color }} />
      {label}
    </span>
  );
}
