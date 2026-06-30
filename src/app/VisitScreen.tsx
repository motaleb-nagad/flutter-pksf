import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useBeneficiary } from '../data/hooks';
import { recordAncVisit } from '../data/repository';
import { Card, SectionLabel } from '../components/ui';
import { Icon } from '../components/Icon';
import { ScreenHeader } from './ScreenHeader';
import { computeAncRisk } from '../domain/risk';
import type { AncServices, AncVisit, DangerSigns } from '../domain/types';

const DANGER_DEFS: { key: keyof DangerSigns; en: string; bn: string }[] = [
  { key: 'bleeding', en: 'Vaginal bleeding', bn: 'যোনিপথে রক্তক্ষরণ' },
  { key: 'headache', en: 'Severe headache', bn: 'তীব্র মাথাব্যথা' },
  { key: 'blurred', en: 'Blurred vision', bn: 'ঝাপসা দৃষ্টি' },
  { key: 'swelling', en: 'Swelling face / hands', bn: 'হাত-মুখ ফোলা' },
  { key: 'convulsions', en: 'Convulsions', bn: 'খিঁচুনি' },
  { key: 'fever', en: 'High fever', bn: 'অতিরিক্ত জ্বর' },
  { key: 'fetal', en: 'Reduced fetal movement', bn: 'নড়াচড়া কম' },
  { key: 'abdo', en: 'Severe abdominal pain', bn: 'তীব্র পেটব্যথা' },
  { key: 'breathing', en: 'Difficult breathing', bn: 'শ্বাসকষ্ট' },
];

const SERVICE_DEFS: { key: keyof AncServices; en: string; bn: string }[] = [
  { key: 'ifa', en: 'IFA tablets given', bn: 'আয়রন-ফলিক ট্যাবলেট' },
  { key: 'tt', en: 'TT / Td up to date', bn: 'টিটি টিকা' },
  { key: 'calcium', en: 'Calcium given', bn: 'ক্যালসিয়াম' },
];

const INITIAL: AncVisit = {
  sbp: 150,
  dbp: 95,
  weight: 58,
  hb: 9.5,
  fundal: 32,
  fhr: 142,
  note: '',
  danger: {
    headache: true,
    blurred: false,
    swelling: true,
    bleeding: false,
    convulsions: false,
    fever: false,
    fetal: false,
    abdo: false,
    breathing: false,
  },
};

function Stepper({
  value,
  onStep,
}: {
  value: number;
  onStep: (delta: number) => void;
}) {
  const btn = {
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
    <>
      <button className="btn-reset" style={btn} onClick={() => onStep(-1)} aria-label="decrease">
        <Icon name="minus" size={16} color="#5C594F" />
      </button>
      <div
        className="mono"
        style={{ width: 60, textAlign: 'center', fontSize: 18, fontWeight: 500 }}
      >
        {value}
      </div>
      <button className="btn-reset" style={btn} onClick={() => onStep(1)} aria-label="increase">
        <Icon name="plus" size={16} color="#5C594F" />
      </button>
    </>
  );
}

export function VisitScreen() {
  const selectedId = useAppStore((s) => s.selectedId);
  const selected = useBeneficiary(selectedId);
  const go = useAppStore((s) => s.go);
  const [v, setV] = useState<AncVisit>(INITIAL);
  const [services, setServices] = useState<AncServices>({ ifa: true, tt: true, calcium: false });
  const [dangerOpen, setDangerOpen] = useState(false);

  const risk = computeAncRisk(v);

  const step = (field: 'sbp' | 'dbp' | 'hb', unit: number) => (delta: number) =>
    setV((s) => ({ ...s, [field]: Math.round((s[field] + delta * unit) * 10) / 10 }));
  const toggleDanger = (k: keyof DangerSigns) =>
    setV((s) => ({ ...s, danger: { ...s.danger, [k]: !s.danger[k] } }));
  const toggleService = (k: keyof AncServices) =>
    setServices((s) => ({ ...s, [k]: !s[k] }));

  const activeDanger = DANGER_DEFS.filter((d) => v.danger[d.key]);
  const dangerSummary = activeDanger.length
    ? `${activeDanger.length} selected · ${activeDanger.map((d) => d.en).join(', ')}`
    : 'Select danger signs · বিপদ চিহ্ন নির্বাচন করুন';

  async function save() {
    await recordAncVisit(selectedId, {
      risk: risk.level,
      reason: risk.reasons[0],
      next: '13 Jul 2026',
    });
    go('profile', 'cases');
  }

  const sectionLabel = { margin: '18px 0 10px' } as const;

  return (
    <div className="sc-fade">
      <ScreenHeader
        title={`ANC visit · ${selected?.name ?? ''}`}
        subtitle={`গর্ভকালীন পরিদর্শন · ${selected?.weeks ?? '—'} weeks`}
        onBack={() => go('home', 'home')}
      />

      <div style={{ padding: 16 }}>
        {/* Live risk banner */}
        <div
          style={{
            background: risk.bg,
            border: `1px solid ${risk.color}`,
            borderRadius: 13,
            padding: '13px 14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: risk.color }} />
            <div style={{ fontWeight: 700, fontSize: 15, color: risk.color }}>
              {risk.label} · {risk.bn}
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--c-text-soft)', marginTop: 3 }}>
            Auto-calculated from vitals &amp; danger signs · স্বয়ংক্রিয় ঝুঁকি নির্ণয়
          </div>
          {risk.reasons.map((r) => (
            <div
              key={r}
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
                marginTop: 7,
                fontSize: 12.5,
                color: 'var(--c-text-soft)',
              }}
            >
              <span style={{ color: risk.color }}>▸</span>
              <span>{r}</span>
            </div>
          ))}
        </div>

        {/* Vitals */}
        <SectionLabel style={sectionLabel}>Vitals · শারীরিক পরিমাপ</SectionLabel>
        <Card style={{ overflow: 'hidden' }}>
          {(
            [
              ['Systolic BP', 'রক্তচাপ (উপরের)', v.sbp, step('sbp', 5)],
              ['Diastolic BP', 'রক্তচাপ (নিচের)', v.dbp, step('dbp', 5)],
              ['Haemoglobin', 'হিমোগ্লোবিন', v.hb, step('hb', 0.5)],
            ] as const
          ).map(([en, bn, value, onStep], i, arr) => (
            <div
              key={en}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '13px 14px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--c-divider)' : 'none',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {en}
                  {en === 'Haemoglobin' && (
                    <span style={{ fontSize: 11, color: 'var(--c-text-muted)' }}> g/dL</span>
                  )}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--c-text-2)' }}>{bn}</div>
              </div>
              <Stepper value={value} onStep={onStep} />
            </div>
          ))}
        </Card>
        <div style={{ display: 'flex', gap: 11, marginTop: 11 }}>
          {(
            [
              ['Weight · ওজন', `${v.weight} kg`],
              ['Fundal · ফান্ডাল', `${v.fundal} cm`],
              ['Fetal HR', `${v.fhr}`],
            ] as const
          ).map(([l, val]) => (
            <Card key={l} style={{ flex: 1, padding: '11px 13px' }}>
              <div style={{ fontSize: 11.5, color: 'var(--c-text-2)' }}>{l}</div>
              <div className="mono" style={{ fontSize: 16, marginTop: 2 }}>
                {val}
              </div>
            </Card>
          ))}
        </div>

        {/* Danger signs */}
        <SectionLabel style={sectionLabel} color="var(--c-risk-high)">
          Danger signs · বিপদ চিহ্ন{' '}
          <span style={{ color: 'var(--c-text-muted)', fontWeight: 500 }}>(select all present)</span>
        </SectionLabel>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDangerOpen((o) => !o)}
            className="btn-reset"
            style={{
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textAlign: 'left',
              background: '#fff',
              border: `1px solid ${activeDanger.length ? 'var(--c-risk-high)' : '#E5E1D8'}`,
              borderRadius: 11,
              padding: '13px 14px',
            }}
          >
            <span
              style={{
                flex: 1,
                fontSize: 13.5,
                fontWeight: 500,
                color: activeDanger.length ? 'var(--c-risk-high)' : 'var(--c-text-muted)',
              }}
            >
              {dangerSummary}
            </span>
            <Icon
              name="chevron-down"
              size={16}
              color="var(--c-text-muted)"
              style={{ transform: dangerOpen ? 'rotate(180deg)' : 'none' }}
            />
          </button>
          {dangerOpen && (
            <div
              style={{
                position: 'absolute',
                zIndex: 20,
                left: 0,
                right: 0,
                top: 'calc(100% + 6px)',
                background: '#fff',
                border: '1px solid #E5E1D8',
                borderRadius: 12,
                boxShadow: 'var(--shadow-pop)',
                overflow: 'hidden',
                maxHeight: 286,
                overflowY: 'auto',
              }}
            >
              {DANGER_DEFS.map((d) => {
                const on = v.danger[d.key];
                return (
                  <div
                    key={d.key}
                    onClick={() => toggleDanger(d.key)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 11,
                      padding: '11px 14px',
                      borderBottom: '1px solid #F3F0E9',
                      background: on ? '#FBEEE9' : '#fff',
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        flexShrink: 0,
                        borderRadius: 6,
                        border: `1.5px solid ${on ? 'var(--c-risk-high)' : '#CFCABF'}`,
                        background: on ? 'var(--c-risk-high)' : '#fff',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {on && <Icon name="check" size={13} color="#fff" />}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: on ? 'var(--c-risk-high)' : 'var(--c-text-soft)',
                        }}
                      >
                        {d.en}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>{d.bn}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Services */}
        <SectionLabel style={sectionLabel}>WHO ANC services · প্রদত্ত সেবা</SectionLabel>
        <Card style={{ overflow: 'hidden' }}>
          {SERVICE_DEFS.map((s, i) => {
            const on = services[s.key];
            return (
              <div
                key={s.key}
                onClick={() => toggleService(s.key)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '12px 14px',
                  borderBottom: i < SERVICE_DEFS.length - 1 ? '1px solid var(--c-divider)' : 'none',
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: on ? 'var(--c-brand)' : '#CFCABF',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="check" size={13} color="#fff" />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{s.en}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>{s.bn}</div>
                </div>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: on ? 'var(--c-brand)' : 'var(--c-text-muted)',
                  }}
                >
                  {on ? 'Given' : 'Pending'}
                </span>
              </div>
            );
          })}
        </Card>

        {/* Referral */}
        {risk.level === 'high' && (
          <div
            style={{
              marginTop: 16,
              background: 'var(--c-risk-high)',
              color: '#fff',
              borderRadius: 13,
              padding: 14,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>⚠ Refer to facility · জরুরি রেফার</div>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 3 }}>
              High-risk vitals detected. Arrange referral to the nearest Upazila Health Complex and
              inform the supervisor.
            </div>
            <button
              className="btn-reset"
              style={{
                marginTop: 11,
                width: '100%',
                cursor: 'pointer',
                background: '#fff',
                color: 'var(--c-risk-high)',
                fontWeight: 700,
                fontSize: 14,
                padding: 12,
                borderRadius: 10,
              }}
            >
              Generate referral slip
            </button>
          </div>
        )}

        <button
          onClick={save}
          className="btn-reset"
          style={{
            width: '100%',
            marginTop: 16,
            cursor: 'pointer',
            background: 'var(--c-brand)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            padding: 15,
            borderRadius: 12,
          }}
        >
          Save visit · সংরক্ষণ
        </button>
        <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--c-text-muted)', marginTop: 9 }}>
          Next visit auto-scheduled · 13 Jul 2026
        </div>
      </div>
    </div>
  );
}
