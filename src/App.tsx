import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { Icon } from './components/Icon';
import { PhoneFrame, BrowserWindow } from './components/Frames';
import { FieldApp } from './app/FieldApp';
import { Portal } from './portal/Portal';

export function App() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const setOnline = useAppStore((s) => s.setOnline);

  // Track real browser connectivity for the offline-first banner.
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, [setOnline]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--c-page-bg)',
        padding: '28px 20px 60px',
      }}
    >
      <header
        style={{
          maxWidth: 1240,
          margin: '0 auto 22px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: 'var(--c-brand)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="cross" size={20} />
            </div>
            <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.01em' }}>
              Preventive Healthcare Programme
            </div>
          </div>
          <div style={{ marginTop: 6, color: 'var(--c-text-2)', fontSize: 14 }}>
            মা ও শিশু স্বাস্থ্য · Maternal &amp; Child Health · field surveillance for
            rural Bangladesh
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Choose surface"
          style={{
            display: 'flex',
            gap: 6,
            background: '#fff',
            padding: 5,
            borderRadius: 12,
            border: '1px solid #E0DBD0',
          }}
        >
          {(['app', 'portal'] as const).map((v) => {
            const active = view === v;
            return (
              <button
                key={v}
                role="tab"
                aria-selected={active}
                onClick={() => setView(v)}
                className="btn-reset"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '9px 16px',
                  borderRadius: 8,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: active ? 'var(--c-brand)' : '#fff',
                  color: active ? '#fff' : '#5C594F',
                }}
              >
                <Icon name={v === 'app' ? 'home' : 'monitor'} size={16} />
                {v === 'app' ? 'Field Officer App' : 'Supervisor Portal'}
              </button>
            );
          })}
        </div>
      </header>

      <main
        key={view}
        className="sc-fade"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        {view === 'app' ? (
          <PhoneFrame>
            <FieldApp />
          </PhoneFrame>
        ) : (
          <BrowserWindow url="health.gov.bd/maa-shishu/dashboard">
            <Portal />
          </BrowserWindow>
        )}
      </main>
    </div>
  );
}
