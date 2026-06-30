import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useBeneficiary } from '../data/hooks';
import { recordChildAssessment } from '../data/repository';
import { Card, SectionLabel } from '../components/ui';
import { Icon } from '../components/Icon';
import { ScreenHeader } from './ScreenHeader';
import { classifyMuac } from '../domain/nutrition';
import type { ChildAssessment } from '../domain/types';

const EPI = [
  ['BCG', 'at birth', 'done'],
  ['OPV-0', 'at birth', 'done'],
  ['Penta-1', '6 wk', 'done'],
  ['PCV-1', '6 wk', 'done'],
  ['Penta-2', '10 wk', 'done'],
  ['Penta-3', '14 wk', 'due'],
  ['PCV-3', '14 wk', 'due'],
  ['IPV', '14 wk', 'due'],
  ['MR-1', '9 mo', 'due'],
  ['MR-2', '15 mo', 'upcoming'],
] as const;

function epiStyle(status: string) {
  if (status === 'done') return { color: '#0E7C66', bg: '#E0EFEA', mark: '✓', label: 'Done' };
  if (status === 'due') return { color: '#C0492E', bg: '#F7E4DE', mark: '!', label: 'Due now' };
  return { color: '#9A958B', bg: '#F1EEE7', mark: '·', label: 'Upcoming' };
}

export function ChildScreen() {
  const selectedId = useAppStore((s) => s.selectedId);
  const selected = useBeneficiary(selectedId);
  const go = useAppStore((s) => s.go);
  const [child, setChild] = useState<ChildAssessment>({
    muac: selected?.muac ?? 11.2,
    weight: 6.9,
    length: 71,
    edema: false,
  });

  const muac = classifyMuac(child.muac, child.edema);
  const stepMuac = (delta: number) =>
    setChild((c) => ({ ...c, muac: Math.round((c.muac + delta) * 10) / 10 }));

  async function save() {
    const risk = muac.short === 'SAM' ? 'high' : muac.short === 'MAM' ? 'medium' : 'low';
    await recordChildAssessment(
      selectedId,
      child,
      { risk, reason: `MUAC ${child.muac} cm — ${muac.short}`, muac: child.muac },
    );
    go('profile', 'cases');
  }

  const stepBtn = {
    width: 34,
    height: 34,
    borderRadius: 9,
    border: '1px solid var(--c-border-4)',
    background: 'var(--c-app-bg)',
    cursor: 'pointer',
    color: '#5C594F',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const;

  return (
    <div className="sc-fade">
      <ScreenHeader
        title="Child health & nutrition"
        subtitle={`শিশু স্বাস্থ্য ও পুষ্টি · ${selected?.months ?? 9} months`}
        onBack={() => go('profile', 'cases')}
      />
      <div style={{ padding: 16 }}>
        {/* MUAC classification */}
        <div
          style={{
            background: muac.bg,
            border: `1px solid ${muac.color}`,
            borderRadius: 13,
            padding: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: muac.color }}>
              {muac.short} · {muac.bn}
            </div>
            <div className="mono" style={{ fontSize: 20, fontWeight: 600, color: muac.color }}>
              {child.muac} cm
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--c-text-soft)', marginTop: 4 }}>{muac.label}</div>
          <div style={{ fontSize: 12, color: muac.color, fontWeight: 600, marginTop: 6 }}>
            → {muac.action}
          </div>
        </div>

        <SectionLabel style={{ margin: '18px 0 10px' }}>Anthropometry · পরিমাপ</SectionLabel>
        <Card style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '13px 14px',
              borderBottom: '1px solid var(--c-divider)',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                MUAC <span style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>mid-upper arm</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--c-text-2)' }}>বাহুর বেড়</div>
            </div>
            <button className="btn-reset" style={stepBtn} onClick={() => stepMuac(-0.1)} aria-label="decrease">
              <Icon name="minus" size={16} color="#5C594F" />
            </button>
            <div className="mono" style={{ width: 64, textAlign: 'center', fontSize: 17 }}>
              {child.muac}
            </div>
            <button className="btn-reset" style={stepBtn} onClick={() => stepMuac(0.1)} aria-label="increase">
              <Icon name="plus" size={16} color="#5C594F" />
            </button>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 14,
              padding: '13px 14px',
              borderBottom: '1px solid var(--c-divider)',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, color: 'var(--c-text-2)' }}>Weight · ওজন</div>
              <div className="mono" style={{ fontSize: 16 }}>
                {child.weight} kg
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, color: 'var(--c-text-2)' }}>Length · দৈর্ঘ্য</div>
              <div className="mono" style={{ fontSize: 16 }}>
                {child.length} cm
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, color: 'var(--c-text-2)' }}>WAZ score</div>
              <div className="mono" style={{ fontSize: 16, color: 'var(--c-risk-high)' }}>
                −2.6
              </div>
            </div>
          </div>
          <div
            onClick={() => setChild((c) => ({ ...c, edema: !c.edema }))}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '13px 14px',
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                border: '1.5px solid var(--c-risk-high)',
                background: child.edema ? 'var(--c-risk-high)' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {child.edema && <Icon name="check" size={13} color="#fff" />}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>Bilateral pitting oedema</div>
              <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>
                দুই পায়ে শোথ — present = SAM
              </div>
            </div>
          </div>
        </Card>

        <SectionLabel style={{ margin: '18px 0 10px' }}>Immunisation (EPI) · টিকা</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EPI.map(([name, when, status]) => {
            const s = epiStyle(status);
            return (
              <div key={name} style={{ background: s.bg, borderRadius: 10, padding: '9px 11px', minWidth: 78 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: s.color,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {s.mark}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 12.5 }}>{name}</span>
                </div>
                <div style={{ fontSize: 10, color: s.color, marginTop: 3 }}>
                  {s.label} · {when}
                </div>
              </div>
            );
          })}
        </div>

        <SectionLabel style={{ margin: '18px 0 10px' }}>
          Feeding &amp; supplements · পুষ্টি
        </SectionLabel>
        <Card style={{ overflow: 'hidden' }}>
          {(
            [
              ['Exclusive breastfeeding 0–6 mo', 'একচেটিয়া বুকের দুধ', 'Yes', 'good'],
              ['Minimum acceptable diet', 'গ্রহণযোগ্য খাদ্য বৈচিত্র্য', '2 / 5 groups', 'warn'],
              ['Vitamin A · Deworming', 'ভিটামিন এ ও কৃমিনাশক', 'Given', 'good'],
            ] as const
          ).map(([en, bn, status, kind], i, arr) => (
            <div
              key={en}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '12px 14px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--c-divider)' : 'none',
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  background: kind === 'good' ? 'var(--c-brand)' : 'var(--c-amber)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                }}
              >
                {kind === 'good' ? <Icon name="check" size={12} color="#fff" /> : '!'}
              </span>
              <div style={{ flex: 1, fontSize: 13.5 }}>
                {en}
                <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>{bn}</div>
              </div>
              <span
                style={{
                  fontSize: 11.5,
                  color: kind === 'good' ? 'var(--c-brand)' : 'var(--c-amber)',
                  fontWeight: 600,
                }}
              >
                {status}
              </span>
            </div>
          ))}
        </Card>

        <button
          onClick={save}
          className="btn-reset"
          style={{
            width: '100%',
            marginTop: 18,
            cursor: 'pointer',
            background: 'var(--c-brand)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            padding: 15,
            borderRadius: 12,
          }}
        >
          Save &amp; refer if SAM · সংরক্ষণ
        </button>
      </div>
    </div>
  );
}
