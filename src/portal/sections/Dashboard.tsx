import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '../../components/ui';
import { useBeneficiaries } from '../../data/hooks';
import { Avatar, RiskBadge } from '../../components/ui';
import { typeLine } from '../../domain/format';
import {
  ANC_TREND,
  ANTIGENS,
  KPIS,
  NUTRITION_BANDS,
  RISK_DISTRIBUTION,
} from '../../domain/dashboard';

const panel = {
  padding: 18,
} as const;
const panelTitle = { fontWeight: 600, fontSize: 14 } as const;
const panelSub = { fontSize: 11.5, color: 'var(--c-text-muted)', marginBottom: 14 } as const;

export function Dashboard() {
  const all = useBeneficiaries();
  const highRows = all
    .filter((b) => b.risk !== 'low')
    .map((b) => ({ ...b, worker: b.village === 'Char Bhola' ? 'R. Sultana' : 'S. Pervin' }));

  return (
    <div style={{ padding: '22px 24px' }}>
      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {KPIS.map((k) => (
          <Card key={k.en} style={{ padding: 16, border: '1px solid var(--c-border-2)' }}>
            <div style={{ fontSize: 12, color: 'var(--c-text-2)' }}>{k.en}</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>{k.bn}</div>
            <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8, letterSpacing: '-0.02em' }}>
              {k.value}
            </div>
            <div style={{ fontSize: 11.5, color: '#8A867C', marginTop: 3 }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      {/* ANC trend + risk distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, marginTop: 14 }}>
        <Card style={{ ...panel, border: '1px solid var(--c-border-2)' }}>
          <div style={panelTitle}>ANC 4+ coverage trend</div>
          <div style={panelSub}>monthly % · গত ৬ মাস</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={ANC_TREND} margin={{ top: 18, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9A958B' }} />
              <YAxis hide domain={[0, 100]} />
              <Bar dataKey="value" fill="#0E7C66" radius={[7, 7, 0, 0]} maxBarSize={38}>
                <LabelList
                  dataKey="value"
                  position="top"
                  style={{ fontSize: 11, fontWeight: 600, fill: '#0E7C66' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ ...panel, border: '1px solid var(--c-border-2)' }}>
          <div style={panelTitle}>Risk distribution</div>
          <div style={panelSub}>active pregnancies</div>
          {RISK_DISTRIBUTION.map((r) => (
            <ProgressRow key={r.label} label={r.label} value={r.value} color={r.color} />
          ))}
        </Card>
      </div>

      {/* Immunisation + nutrition */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, marginTop: 14 }}>
        <Card style={{ ...panel, border: '1px solid var(--c-border-2)' }}>
          <div style={panelTitle}>Immunisation coverage by antigen</div>
          <div style={panelSub}>EPI schedule · %</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={ANTIGENS} margin={{ top: 18, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9A958B' }} />
              <YAxis hide domain={[0, 100]} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={30}>
                {ANTIGENS.map((a) => (
                  <Cell key={a.label} fill={a.color} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  style={{ fontSize: 10.5, fontWeight: 600, fill: '#5C594F' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ ...panel, border: '1px solid var(--c-border-2)' }}>
          <div style={panelTitle}>Nutrition status</div>
          <div style={panelSub}>children under 5 · MUAC</div>
          <div style={{ display: 'flex', height: 22, borderRadius: 7, overflow: 'hidden', marginBottom: 14 }}>
            {NUTRITION_BANDS.map((n) => (
              <div key={n.label} style={{ width: `${n.value}%`, background: n.color }} />
            ))}
          </div>
          {NUTRITION_BANDS.map((n) => (
            <div
              key={n.label}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, marginBottom: 8 }}
            >
              <span style={{ width: 11, height: 11, borderRadius: 3, background: n.color }} />
              <span style={{ flex: 1 }}>{n.label}</span>
              <span style={{ fontWeight: 600 }}>{n.value}%</span>
            </div>
          ))}
        </Card>
      </div>

      {/* High-risk table */}
      <Card style={{ ...panel, border: '1px solid var(--c-border-2)', marginTop: 14 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div style={panelTitle}>High-risk cases needing follow-up</div>
          <span style={{ fontSize: 12, color: 'var(--c-brand)', fontWeight: 600, cursor: 'pointer' }}>
            View all →
          </span>
        </div>
        <TableHead cols="1.6fr 1fr 1fr 1.4fr 0.9fr" headers={['Name', 'Type', 'Village', 'Reason', 'Risk']} />
        {highRows.map((h) => {
          const t = typeLine(h);
          return (
            <div
              key={h.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.6fr 1fr 1fr 1.4fr 0.9fr',
                gap: 8,
                fontSize: 12.5,
                alignItems: 'center',
                padding: '11px 4px',
                borderBottom: '1px solid #F3F0E9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Avatar name={h.name} level={h.risk} size={30} />
                <span style={{ fontWeight: 500 }}>{h.name}</span>
              </div>
              <div style={{ color: 'var(--c-text-2)' }}>{t.en}</div>
              <div style={{ color: 'var(--c-text-2)' }}>{h.village}</div>
              <div style={{ color: 'var(--c-text-2)' }}>{h.reason}</div>
              <div>
                <RiskBadge level={h.risk} />
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function ProgressRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 600, color }}>{value}%</span>
      </div>
      <div style={{ height: 9, borderRadius: 5, background: '#EFEBE2' }}>
        <div style={{ height: 9, borderRadius: 5, width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function TableHead({ cols, headers }: { cols: string; headers: string[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: cols,
        gap: 8,
        fontSize: 11,
        color: 'var(--c-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '.04em',
        padding: '0 4px 8px',
        borderBottom: '1px solid #EFEBE2',
      }}
    >
      {headers.map((h) => (
        <div key={h}>{h}</div>
      ))}
    </div>
  );
}
