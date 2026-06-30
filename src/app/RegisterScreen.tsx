import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, SectionLabel } from '../components/ui';
import { Icon } from '../components/Icon';
import { ScreenHeader } from './ScreenHeader';

/** Multi-field registration capturing personal, location (GPS) & pregnancy data. */
export function RegisterScreen() {
  const go = useAppStore((s) => s.go);
  const [gps, setGps] = useState('22.318° N, 90.951° E');
  const [capturing, setCapturing] = useState(false);

  function captureGps() {
    setCapturing(true);
    // Field surveillance needs a real coordinate; fall back to a fixed sample
    // when geolocation is unavailable (e.g. desktop preview).
    const done = (lat: number, lng: number) => {
      setGps(`${lat.toFixed(3)}° N, ${lng.toFixed(3)}° E`);
      setCapturing(false);
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => done(p.coords.latitude, p.coords.longitude),
        () => done(22.318, 90.951),
        { timeout: 4000 },
      );
    } else {
      done(22.318, 90.951);
    }
  }

  const field = {
    padding: '11px 0',
    borderBottom: '1px solid var(--c-divider)',
  } as const;
  const label = { fontSize: 11.5, color: 'var(--c-text-2)' } as const;
  const input = {
    border: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: 14.5,
    width: '100%',
    paddingTop: 3,
    background: 'transparent',
    color: 'var(--c-text)',
  } as const;

  return (
    <div className="sc-fade">
      <ScreenHeader
        title="New registration"
        subtitle="নতুন নিবন্ধন"
        onBack={() => go('home', 'home')}
        right={
          <span
            style={{
              fontSize: 12,
              background: 'rgba(255,255,255,0.18)',
              padding: '4px 10px',
              borderRadius: 20,
            }}
          >
            Step 1 / 3
          </span>
        }
      />

      <div style={{ padding: 16 }}>
        <SectionLabel style={{ marginBottom: 10 }}>Personal · ব্যক্তিগত তথ্য</SectionLabel>
        <Card style={{ padding: '6px 14px' }}>
          <div style={field}>
            <div style={label}>Full name · নাম</div>
            <input defaultValue="Rahima Begum" style={input} />
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ ...field, flex: 1 }}>
              <div style={label}>Age · বয়স</div>
              <input defaultValue="19" style={input} />
            </div>
            <div style={{ ...field, flex: 1.4 }}>
              <div style={label}>Mobile · মোবাইল</div>
              <input defaultValue="017XX-XXXXXX" style={input} />
            </div>
          </div>
          <div style={{ padding: '11px 0' }}>
            <div style={label}>NID / Birth reg. no.</div>
            <input
              defaultValue="1990 4521 8847"
              className="mono"
              style={{ ...input, fontSize: 14 }}
            />
          </div>
        </Card>

        <SectionLabel style={{ margin: '18px 0 10px' }}>Location · অবস্থান</SectionLabel>
        <Card style={{ padding: '6px 14px' }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ ...field, flex: 1 }}>
              <div style={label}>Village · গ্রাম</div>
              <input defaultValue="Char Bhola" style={input} />
            </div>
            <div style={{ ...field, flex: 1 }}>
              <div style={label}>Union</div>
              <input defaultValue="Char Bhola" style={input} />
            </div>
          </div>
          <div
            style={{
              padding: '11px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={label}>GPS location</div>
              <div className="mono" style={{ fontSize: 12.5, paddingTop: 3 }}>
                {gps}
              </div>
            </div>
            <button
              onClick={captureGps}
              className="btn-reset"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer',
                fontSize: 11.5,
                color: 'var(--c-brand)',
                fontWeight: 600,
              }}
            >
              <Icon name="pin" size={14} color="var(--c-brand)" />
              {capturing ? 'Capturing…' : 'Captured'}
            </button>
          </div>
        </Card>

        <SectionLabel style={{ margin: '18px 0 10px' }}>Pregnancy · গর্ভকাল</SectionLabel>
        <Card style={{ padding: '6px 14px' }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ ...field, flex: 1 }}>
              <div style={label}>LMP · শেষ মাসিক</div>
              <input defaultValue="05 Jan 2026" style={{ ...input, fontSize: 14 }} />
            </div>
            <div style={{ ...field, flex: 1, background: '#F4FAF7' }}>
              <div style={{ ...label, color: 'var(--c-brand)' }}>EDD (auto)</div>
              <div style={{ fontSize: 14, paddingTop: 3, fontWeight: 600 }}>12 Aug 2026</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <div style={{ padding: '11px 0', flex: 1 }}>
              <div style={label}>Gravida</div>
              <input defaultValue="2" style={input} />
            </div>
            <div style={{ padding: '11px 0', flex: 1 }}>
              <div style={label}>Para</div>
              <input defaultValue="1" style={input} />
            </div>
            <div style={{ padding: '11px 0', flex: 1 }}>
              <div style={label}>Blood grp</div>
              <input defaultValue="B+" style={input} />
            </div>
          </div>
        </Card>

        <button
          onClick={() => go('visit', 'add')}
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
          Save &amp; start first ANC visit →
        </button>
        <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--c-text-muted)', marginTop: 9 }}>
          Saved offline · will sync automatically
        </div>
      </div>
    </div>
  );
}
