import { useState } from 'react';
import { Icon } from '../components/Icon';
import { SectionLabel } from '../components/ui';
import { addWorker } from '../data/repository';
import { useWorkers } from '../data/hooks';
import { genPassword, genUsername } from '../domain/format';
import { ROLES, UNIONS } from '../domain/seed';
import type { WorkerRole } from '../domain/types';

interface Draft {
  name: string;
  age: string;
  phone: string;
  nid: string;
  lat: string;
  lng: string;
  locMethod: '' | 'gps' | 'map';
  pinX: number;
  pinY: number;
  union: string;
  role: WorkerRole;
}

const EMPTY: Draft = {
  name: '',
  age: '',
  phone: '',
  nid: '',
  lat: '',
  lng: '',
  locMethod: '',
  pinX: 50,
  pinY: 48,
  union: 'Char Bhola',
  role: 'FWA',
};

export function OnboardModal({ onClose }: { onClose: () => void }) {
  const workers = useWorkers();
  const [ob, setOb] = useState<Draft>(EMPTY);
  const [step, setStep] = useState<'form' | 'done'>('form');
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [copied, setCopied] = useState(false);

  const valid = ob.name.trim() && ob.age && ob.nid.trim() && ob.phone.trim();
  const hasLoc = !!ob.lat;

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setOb((s) => ({ ...s, [k]: v }));

  function captureGps() {
    setOb((s) => ({ ...s, lat: '22.3186', lng: '90.9512', locMethod: 'gps', pinX: 50, pinY: 48 }));
  }

  function pickOnMap(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    const py = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
    const lat = (22.45 - py * 0.3).toFixed(4);
    const lng = (90.8 + px * 0.3).toFixed(4);
    setOb((s) => ({
      ...s,
      lat,
      lng,
      locMethod: 'map',
      pinX: Math.round(px * 100),
      pinY: Math.round(py * 100),
    }));
  }

  async function generate() {
    if (!valid) return;
    const username = genUsername(ob.name, ob.union, workers.length + 1);
    const password = genPassword();
    await addWorker({
      id: `w${Date.now()}`,
      name: ob.name.trim(),
      role: ob.role,
      union: ob.union,
      assigned: 0,
      high: 0,
      visits: 0,
      cov: 0,
      lastSync: 'Never',
      status: 'offline',
    });
    setCreds({ username, password });
    setStep('done');
  }

  function copyCreds() {
    const text = `Username: ${creds.username}\nPassword: ${creds.password}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
  }

  const input = {
    width: '100%',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    fontSize: 14,
    padding: '11px 12px',
    border: '1px solid var(--c-border-4)',
    borderRadius: 9,
    outline: 'none',
    background: '#fff',
  };
  const fieldLabel = { fontSize: 12, color: 'var(--c-text-2)', marginBottom: 5 } as const;

  return (
    <div
      className="sc-fade"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: 'rgba(20,28,25,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
      }}
    >
      <div
        style={{
          width: 560,
          maxWidth: '100%',
          maxHeight: '100%',
          overflow: 'auto',
          background: 'var(--c-app-bg)',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            background: 'var(--c-brand)',
            color: '#fff',
            padding: '16px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Onboard field officer</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>নতুন মাঠকর্মী যুক্ত করুন</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="btn-reset"
            style={{
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.16)',
              color: '#fff',
              width: 30,
              height: 30,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="close" size={16} color="#fff" />
          </button>
        </div>

        {step === 'form' ? (
          <div style={{ padding: 22 }}>
            <SectionLabel style={{ marginBottom: 11 }}>
              Field officer details · কর্মীর তথ্য
            </SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={fieldLabel}>Full name · নাম</div>
                <input
                  value={ob.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Sahida Khatun"
                  style={input}
                />
              </div>
              <div>
                <div style={fieldLabel}>Age · বয়স</div>
                <input value={ob.age} onChange={(e) => set('age', e.target.value)} placeholder="e.g. 28" style={input} />
              </div>
              <div>
                <div style={fieldLabel}>Phone · মোবাইল</div>
                <input
                  value={ob.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="017XX-XXXXXX"
                  style={input}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={fieldLabel}>National ID (NID) · জাতীয় পরিচয়পত্র</div>
                <input
                  value={ob.nid}
                  onChange={(e) => set('nid', e.target.value)}
                  placeholder="10 or 17 digit NID"
                  className="mono"
                  style={input}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <div style={{ fontSize: 12, color: 'var(--c-text-2)' }}>Location · অবস্থান</div>
                  {hasLoc && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--c-brand)',
                        background: '#E0EFEA',
                        padding: '3px 9px',
                        borderRadius: 20,
                      }}
                    >
                      ✓ {ob.locMethod === 'gps' ? 'GPS auto-captured' : 'Pinned on map'}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 9, alignItems: 'stretch' }}>
                  <button
                    onClick={captureGps}
                    className="btn-reset"
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      padding: '10px 14px',
                      borderRadius: 9,
                      whiteSpace: 'nowrap',
                      border: `1px solid ${ob.locMethod === 'gps' ? 'var(--c-brand)' : '#9DBBB1'}`,
                      background: ob.locMethod === 'gps' ? 'var(--c-brand)' : '#fff',
                      color: ob.locMethod === 'gps' ? '#fff' : 'var(--c-brand)',
                    }}
                  >
                    <Icon name="pin" size={14} color={ob.locMethod === 'gps' ? '#fff' : 'var(--c-brand)'} /> Use GPS
                  </button>
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 13px',
                      border: '1px dashed #C9D6CF',
                      borderRadius: 9,
                      fontSize: 12,
                      color: '#8A867C',
                      background: '#fff',
                    }}
                  >
                    or tap the map below to drop a pin
                  </div>
                </div>
                <div
                  onClick={pickOnMap}
                  style={{
                    position: 'relative',
                    marginTop: 9,
                    height: 158,
                    borderRadius: 11,
                    overflow: 'hidden',
                    cursor: 'crosshair',
                    border: '1px solid var(--c-border-4)',
                    background: '#DBE6DC',
                    backgroundImage:
                      'linear-gradient(115deg, transparent 46%, #BAD3E0 46%, #BAD3E0 56%, transparent 56%), repeating-linear-gradient(0deg, rgba(120,130,120,0.18) 0 1px, transparent 1px 26px), repeating-linear-gradient(90deg, rgba(120,130,120,0.18) 0 1px, transparent 1px 26px), radial-gradient(circle at 22% 70%, #C6D9B8 0 24px, transparent 25px), radial-gradient(circle at 78% 30%, #C6D9B8 0 30px, transparent 31px)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 8,
                      top: 7,
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#5E6B5F',
                      background: 'rgba(255,255,255,0.7)',
                      padding: '2px 7px',
                      borderRadius: 5,
                    }}
                  >
                    Bhola District · ভোলা
                  </div>
                  {hasLoc && (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${ob.pinX}%`,
                        top: `${ob.pinY}%`,
                        transform: 'translate(-50%,-100%)',
                        pointerEvents: 'none',
                        color: 'var(--c-risk-high)',
                        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.35))',
                      }}
                    >
                      <Icon name="pin" size={26} color="var(--c-risk-high)" />
                    </div>
                  )}
                </div>
                {hasLoc && (
                  <div
                    className="mono"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      marginTop: 8,
                      fontSize: 12.5,
                      color: 'var(--c-text-soft)',
                    }}
                  >
                    <Icon name="crosshair" size={14} color="var(--c-brand)" />
                    {ob.lat}° N, {ob.lng}° E
                  </div>
                )}
              </div>
            </div>

            <SectionLabel style={{ margin: '18px 0 10px' }}>Assignment · দায়িত্ব</SectionLabel>
            <div style={{ fontSize: 12, color: 'var(--c-text-2)', marginBottom: 7 }}>Union</div>
            <ChipRow
              options={UNIONS}
              value={ob.union}
              onChange={(v) => set('union', v)}
            />
            <div style={{ fontSize: 12, color: 'var(--c-text-2)', margin: '13px 0 7px' }}>Role · পদবি</div>
            <ChipRow
              options={ROLES as unknown as string[]}
              value={ob.role}
              onChange={(v) => set('role', v as WorkerRole)}
            />

            <button
              onClick={generate}
              disabled={!valid}
              className="btn-reset"
              style={{
                width: '100%',
                marginTop: 22,
                cursor: valid ? 'pointer' : 'default',
                fontWeight: 600,
                fontSize: 15,
                padding: 14,
                borderRadius: 11,
                background: valid ? 'var(--c-brand)' : '#9DB8AF',
                color: '#fff',
              }}
            >
              Create account &amp; generate login →
            </button>
            <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--c-text-muted)', marginTop: 9 }}>
              {valid
                ? 'Username & password generated automatically'
                : 'Fill name, age, NID and phone to continue'}
            </div>
          </div>
        ) : (
          <div style={{ padding: 22 }}>
            <div style={{ textAlign: 'center', padding: '6px 0 16px' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  margin: '0 auto',
                  borderRadius: '50%',
                  background: '#E0EFEA',
                  color: 'var(--c-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="check" size={26} color="var(--c-brand)" />
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, marginTop: 11 }}>{ob.name} added</div>
              <div style={{ fontSize: 12.5, color: 'var(--c-text-2)', marginTop: 3 }}>
                Account created · share these credentials securely
              </div>
            </div>
            <div style={{ background: 'var(--c-brand)', color: '#fff', borderRadius: 13, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: '.05em', textTransform: 'uppercase' }}>
                Username
              </div>
              <div className="mono" style={{ fontSize: 20, fontWeight: 600, marginTop: 3 }}>
                {creds.username}
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.18)', margin: '14px 0' }} />
              <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: '.05em', textTransform: 'uppercase' }}>
                Temporary password
              </div>
              <div className="mono" style={{ fontSize: 20, fontWeight: 600, marginTop: 3 }}>
                {creds.password}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: 12,
                color: 'var(--c-text-2)',
                marginTop: 13,
                lineHeight: 1.45,
              }}
            >
              <span style={{ color: 'var(--c-risk-medium)' }}>⚠</span>
              <span>
                The field officer enters these in the mobile app to log in. They will be asked to
                change the password on first sign-in.
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button
                onClick={copyCreds}
                className="btn-reset"
                style={{
                  flex: 1,
                  cursor: 'pointer',
                  border: '1px solid var(--c-border-4)',
                  background: '#fff',
                  fontWeight: 600,
                  fontSize: 14,
                  padding: 13,
                  borderRadius: 11,
                  color: 'var(--c-text)',
                }}
              >
                {copied ? 'Copied ✓' : 'Copy credentials'}
              </button>
              <button
                onClick={onClose}
                className="btn-reset"
                style={{
                  flex: 1,
                  cursor: 'pointer',
                  background: 'var(--c-brand)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 14,
                  padding: 13,
                  borderRadius: 11,
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChipRow({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
      {options.map((o) => {
        const sel = value === o;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className="btn-reset"
            style={{
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: 500,
              padding: '8px 13px',
              borderRadius: 8,
              border: `1px solid ${sel ? 'var(--c-brand)' : 'var(--c-border-4)'}`,
              background: sel ? 'var(--c-brand)' : '#fff',
              color: sel ? '#fff' : '#5C594F',
            }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
