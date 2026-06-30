import { useState } from 'react';
import { useAppStore, filterBeneficiaries, type ListFilter } from '../store/useAppStore';
import { useBeneficiaries } from '../data/hooks';
import { Avatar, Card, RiskBadge } from '../components/ui';
import { Icon } from '../components/Icon';
import { typeLine } from '../domain/format';

const CHIPS: { key: ListFilter; en: string }[] = [
  { key: 'all', en: 'All' },
  { key: 'adolescent', en: 'Adolescent' },
  { key: 'elderly', en: 'Elderly' },
  { key: 'disabled', en: 'Disability' },
  { key: 'pregnant', en: 'Pregnant' },
  { key: 'child', en: 'Child' },
];

export function ListScreen() {
  const all = useBeneficiaries();
  const listFilter = useAppStore((s) => s.listFilter);
  const setFilter = useAppStore((s) => s.setFilter);
  const openProfile = useAppStore((s) => s.openProfile);
  const [query, setQuery] = useState('');

  let cases = filterBeneficiaries(all, listFilter);
  const q = query.trim().toLowerCase();
  if (q) {
    cases = cases.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.bn.includes(query.trim()) ||
        b.code.toLowerCase().includes(q),
    );
  }

  return (
    <div className="sc-fade">
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid var(--c-border-1)',
          padding: '16px 16px 12px',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 17 }}>Beneficiaries</div>
        <div style={{ fontSize: 12.5, color: 'var(--c-text-2)', marginBottom: 11 }}>
          উপকারভোগীর তালিকা
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            background: '#F2EFE8',
            borderRadius: 10,
            padding: '10px 12px',
          }}
        >
          <Icon name="search" size={16} color="var(--c-text-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or ID · নাম খুঁজুন"
            className="btn-reset"
            style={{
              flex: 1,
              outline: 'none',
              background: 'transparent',
              fontSize: 13.5,
              color: 'var(--c-text)',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 7, marginTop: 11, overflow: 'auto' }}>
          {CHIPS.map((c) => {
            const on = listFilter === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className="btn-reset"
                style={{
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontSize: 12.5,
                  fontWeight: 600,
                  padding: '7px 13px',
                  borderRadius: 20,
                  border: `1px solid ${on ? 'var(--c-brand)' : '#E5E1D8'}`,
                  background: on ? 'var(--c-brand)' : '#fff',
                  color: on ? '#fff' : '#5C594F',
                }}
              >
                {c.en}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {cases.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--c-text-muted)', padding: 30, fontSize: 13 }}>
            No beneficiaries match · কোনো ফলাফল নেই
          </div>
        )}
        {cases.map((b) => {
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
              <Avatar name={b.name} level={b.risk} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: 'var(--c-text-2)' }}>
                  {t.en} · {b.village}
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 10.5, color: 'var(--c-text-muted)', marginTop: 2 }}
                >
                  {b.code} · next {b.next}
                </div>
              </div>
              <RiskBadge level={b.risk} text="bn" />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
