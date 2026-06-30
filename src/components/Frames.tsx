/*
 * Presentation chrome only — a phone frame for the field app and a browser
 * window for the portal, mirroring the design reference's intent (offline mobile
 * app vs desktop web portal). These are cosmetic wrappers, not domain code.
 */
import type { ReactNode } from 'react';

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 412,
        maxWidth: '100%',
        height: 'min(892px, calc(100vh - 150px))',
        background: '#0c0c0e',
        borderRadius: 44,
        padding: 12,
        boxShadow: '0 24px 70px rgba(0,0,0,0.28)',
      }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          borderRadius: 33,
          overflow: 'hidden',
          background: 'var(--c-app-bg)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* notch */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 132,
            height: 22,
            background: '#0c0c0e',
            borderRadius: '0 0 14px 14px',
            zIndex: 60,
          }}
        />
        {children}
      </div>
    </div>
  );
}

export function BrowserWindow({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        width: 1200,
        maxWidth: '100%',
        height: 'min(760px, calc(100vh - 150px))',
        background: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid #d9d4c9',
        boxShadow: '0 24px 70px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '10px 14px',
          background: '#ECE7DD',
          borderBottom: '1px solid #d9d4c9',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: 7 }}>
          {['#ef6a5e', '#f5bd4f', '#61c554'].map((c) => (
            <span
              key={c}
              style={{ width: 12, height: 12, borderRadius: '50%', background: c }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            background: '#fff',
            border: '1px solid #DCD7CC',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 12.5,
            color: '#6A665C',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}
