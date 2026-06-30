import { useAppStore } from '../store/useAppStore';
import { useBeneficiary } from '../data/hooks';
import { Card, RiskBadge, SectionLabel } from '../components/ui';
import { Icon } from '../components/Icon';
import { typeLine } from '../domain/format';
import { classifyMuac } from '../domain/nutrition';
import { generalProfileMeta } from './profileMeta';
import type { Beneficiary } from '../domain/types';

const EPI_CHIPS = [
  ['BCG', 'done'],
  ['Penta-3', 'due'],
  ['PCV-3', 'due'],
  ['IPV', 'due'],
  ['MR-1', 'due'],
] as const;

function ProfileHeader({ b, onBack }: { b: Beneficiary; onBack: () => void }) {
  const t = typeLine(b);
  return (
    <div style={{ background: 'var(--c-brand)', color: '#fff', padding: '14px 16px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} aria-label="Back" className="btn-reset" style={{ cursor: 'pointer', display: 'flex' }}>
          <Icon name="chevron-left" size={22} color="#fff" />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{b.name}</div>
          <div style={{ fontSize: 11.5, opacity: 0.85 }}>
            {b.bn} · {t.en}
          </div>
        </div>
        <RiskBadge level={b.risk} variant="solid" />
      </div>
      <div style={{ display: 'flex', gap: 18, marginTop: 13, fontSize: 12, opacity: 0.92 }}>
        <div>
          <div style={{ opacity: 0.7, fontSize: 10.5 }}>ID</div>
          <span className="mono">{b.code}</span>
        </div>
        <div>
          <div style={{ opacity: 0.7, fontSize: 10.5 }}>Village</div>
          {b.village}
        </div>
        <div>
          <div style={{ opacity: 0.7, fontSize: 10.5 }}>Next visit</div>
          {b.next}
        </div>
      </div>
    </div>
  );
}

const primaryBtn = {
  width: '100%',
  marginTop: 16,
  cursor: 'pointer',
  background: 'var(--c-brand)',
  color: '#fff',
  fontWeight: 600,
  fontSize: 15,
  padding: 14,
  borderRadius: 12,
} as const;

export function ProfileScreen() {
  const selectedId = useAppStore((s) => s.selectedId);
  const b = useBeneficiary(selectedId);
  const go = useAppStore((s) => s.go);
  const setFilter = useAppStore((s) => s.setFilter);

  if (!b) return null;
  const back = () => setFilter('all');

  const isAnc = b.type === 'anc' || b.type === 'pnc';
  const isChild = b.type === 'child';

  return (
    <div className="sc-fade">
      <ProfileHeader b={b} onBack={back} />

      {isAnc && <AncProfile b={b} onVisit={() => go('visit', 'cases')} />}
      {isChild && <ChildProfile b={b} onRecord={() => go('child', 'cases')} />}
      {!isAnc && !isChild && <GeneralProfile b={b} onRecord={() => setFilter('all')} />}
    </div>
  );
}

function AncProfile({ b, onVisit }: { b: Beneficiary; onVisit: () => void }) {
  const ancCount = b.anc ?? 0;
  return (
    <div style={{ padding: 16 }}>
      <Card style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 600, fontSize: 13.5 }}>
            ANC contacts <span style={{ color: 'var(--c-text-muted)', fontWeight: 400 }}>· WHO target 8</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--c-brand)', fontWeight: 700 }}>{ancCount} / 8</div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 11 }}>
          {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => {
            const done = n <= ancCount;
            return (
              <div
                key={n}
                style={{
                  flex: 1,
                  height: 28,
                  borderRadius: 7,
                  background: done ? 'var(--c-brand)' : '#E5E1D8',
                  color: done ? '#fff' : 'var(--c-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--c-text-2)', marginTop: 9 }}>
          EDD {b.edd ?? '—'} · {b.weeks ?? '—'} weeks gestation
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 11, marginTop: 12 }}>
        {(
          [
            ['Latest BP', '150/95', 'High — monitor', 'high'],
            ['Haemoglobin', '9.5', 'Mild anaemia', 'medium'],
            ['Weight', '58', '+1.2 kg', 'low'],
          ] as const
        ).map(([l, val, sub, level]) => (
          <div
            key={l}
            style={{ flex: 1, background: `var(--c-risk-${level}-bg)`, borderRadius: 12, padding: 12 }}
          >
            <div style={{ fontSize: 11.5, color: `var(--c-risk-${level})` }}>{l}</div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 600, color: `var(--c-risk-${level})` }}>
              {val}
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--c-text-2)' }}>{sub}</div>
          </div>
        ))}
      </div>

      <SectionLabel style={{ margin: '18px 0 10px' }}>Care checklist · সেবা তালিকা</SectionLabel>
      <Card style={{ overflow: 'hidden' }}>
        {(
          [
            ['TT / Td immunisation · টিটি টিকা', '2 doses', 'good'],
            ['IFA supplementation · আয়রন-ফলিক', 'On track', 'good'],
            ['Calcium supplementation', 'Pending', 'warn'],
            ['Birth & complication plan · প্রসব পরিকল্পনা', 'Incomplete', 'warn'],
          ] as const
        ).map(([label, status, kind], i, arr) => (
          <ChecklistRow key={label} label={label} status={status} kind={kind} last={i === arr.length - 1} />
        ))}
      </Card>

      <button onClick={onVisit} className="btn-reset" style={primaryBtn}>
        Record new ANC visit
      </button>
    </div>
  );
}

function ChildProfile({ b, onRecord }: { b: Beneficiary; onRecord: () => void }) {
  const muac = classifyMuac(b.muac ?? 11.2, false);
  return (
    <div style={{ padding: 16 }}>
      <div style={{ background: muac.bg, border: `1px solid ${muac.color}`, borderRadius: 13, padding: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: muac.color }}>
          {muac.short} · {muac.label}
        </div>
        <div style={{ fontSize: 12, color: muac.color, fontWeight: 600, marginTop: 5 }}>
          → {muac.action}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 11, marginTop: 12 }}>
        {(
          [
            ['MUAC', `${b.muac ?? '—'}`, 'var(--c-risk-high)'],
            ['Weight-for-age', '−2.6', 'var(--c-risk-high)'],
            ['Length-for-age', '−1.9', 'var(--c-risk-medium)'],
          ] as const
        ).map(([l, val, color]) => (
          <Card key={l} style={{ flex: 1, padding: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--c-text-2)' }}>{l}</div>
            <div className="mono" style={{ fontSize: 17, fontWeight: 600, color }}>
              {val}
            </div>
          </Card>
        ))}
      </div>

      <SectionLabel style={{ margin: '18px 0 10px' }}>Immunisation (EPI) · টিকা</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {EPI_CHIPS.map(([name, status]) => {
          const color = status === 'done' ? '#0E7C66' : '#C0492E';
          const bg = status === 'done' ? '#E0EFEA' : '#F7E4DE';
          return (
            <div key={name} style={{ background: bg, borderRadius: 10, padding: '8px 10px', minWidth: 74 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    background: color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  {status === 'done' ? '✓' : '!'}
                </span>
                <span style={{ fontWeight: 600, fontSize: 12 }}>{name}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onRecord} className="btn-reset" style={primaryBtn}>
        Record growth &amp; nutrition
      </button>
    </div>
  );
}

function GeneralProfile({ b, onRecord }: { b: Beneficiary; onRecord: () => void }) {
  const meta = generalProfileMeta(b.type);
  const t = typeLine(b);
  return (
    <div style={{ padding: 16 }}>
      <div style={{ background: '#E0EFEA', border: '1px solid var(--c-brand)', borderRadius: 13, padding: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--c-brand-deep)' }}>{meta.title}</div>
        <div style={{ fontSize: 12, color: 'var(--c-brand)', marginTop: 4 }}>
          {meta.bn} · {t.en}
        </div>
        {b.reason && (
          <div style={{ fontSize: 12, color: 'var(--c-text-soft)', marginTop: 8 }}>{b.reason}</div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 11, marginTop: 12 }}>
        <Card style={{ flex: 1, padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--c-text-2)' }}>Age · বয়স</div>
          <div className="mono" style={{ fontSize: 17, fontWeight: 600 }}>
            {b.age ?? '—'}
          </div>
        </Card>
        <Card style={{ flex: 1, padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--c-text-2)' }}>Risk · ঝুঁকি</div>
          <div
            className="mono"
            style={{ fontSize: 14, fontWeight: 600, color: `var(--c-risk-${b.risk})`, paddingTop: 3 }}
          >
            {b.risk[0].toUpperCase() + b.risk.slice(1)} risk
          </div>
        </Card>
        <Card style={{ flex: 1, padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--c-text-2)' }}>Next visit</div>
          <div style={{ fontSize: 14, fontWeight: 600, paddingTop: 3 }}>{b.next}</div>
        </Card>
      </div>

      <SectionLabel style={{ margin: '18px 0 10px' }}>Care checklist · সেবা তালিকা</SectionLabel>
      <Card style={{ overflow: 'hidden' }}>
        {meta.items.map((it, i) => (
          <div
            key={it.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '11px 14px',
              borderBottom: i < meta.items.length - 1 ? '1px solid var(--c-divider)' : 'none',
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                background: it.color,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}
            >
              {it.mark}
            </span>
            <div style={{ flex: 1, fontSize: 13 }}>{it.label}</div>
            <span style={{ fontSize: 11, color: it.color, fontWeight: 600 }}>{it.statusLabel}</span>
          </div>
        ))}
      </Card>

      <button onClick={onRecord} className="btn-reset" style={primaryBtn}>
        Record new visit · নতুন পরিদর্শন
      </button>
    </div>
  );
}

function ChecklistRow({
  label,
  status,
  kind,
  last,
}: {
  label: string;
  status: string;
  kind: 'good' | 'warn';
  last: boolean;
}) {
  const color = kind === 'good' ? 'var(--c-brand)' : 'var(--c-amber)';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '11px 14px',
        borderBottom: last ? 'none' : '1px solid var(--c-divider)',
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 5,
          background: color,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
        }}
      >
        {kind === 'good' ? <Icon name="check" size={12} color="#fff" /> : '!'}
      </span>
      <div style={{ flex: 1, fontSize: 13 }}>{label}</div>
      <span style={{ fontSize: 11, color, fontWeight: 600 }}>{status}</span>
    </div>
  );
}
