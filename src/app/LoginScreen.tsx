import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Icon } from '../components/Icon';
import { CURRENT_OFFICER } from '../domain/seed';

export function LoginScreen() {
  const appLogin = useAppStore((s) => s.appLogin);
  const [user, setUser] = useState(CURRENT_OFFICER.username);
  const [pass, setPass] = useState('');

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box' as const,
    fontFamily: 'var(--font-mono)',
    fontSize: 15,
    padding: '13px 14px',
    border: 'none',
    borderRadius: 11,
    outline: 'none',
    background: 'rgba(255,255,255,0.95)',
    color: 'var(--c-text)',
  };

  return (
    <form
      className="sc-fade"
      onSubmit={(e) => {
        e.preventDefault();
        appLogin();
      }}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--c-brand)',
        color: '#fff',
        padding: '0 26px',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <Icon name="cross" size={30} />
        </div>
        <div style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.2 }}>
          Preventive Healthcare
        </div>
        <div style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
          মা ও শিশু স্বাস্থ্য · Field Officer
        </div>

        <div style={{ marginTop: 30 }}>
          <label style={{ fontSize: 12.5, opacity: 0.85, marginBottom: 6, display: 'block' }}>
            Username · ইউজারনেম
          </label>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="provided by supervisor"
            style={inputStyle}
          />
          <label style={{ fontSize: 12.5, opacity: 0.85, margin: '16px 0 6px', display: 'block' }}>
            Password · পাসওয়ার্ড
          </label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          className="btn-reset"
          style={{
            width: '100%',
            marginTop: 24,
            cursor: 'pointer',
            background: '#fff',
            color: 'var(--c-brand)',
            fontWeight: 700,
            fontSize: 16,
            padding: 15,
            borderRadius: 12,
          }}
        >
          Log in · প্রবেশ
        </button>
        <div style={{ textAlign: 'center', fontSize: 12, opacity: 0.8, marginTop: 14 }}>
          Credentials are issued by your supervisor
          <br />
          from the web portal
        </div>
      </div>
      <div style={{ paddingBottom: 22, textAlign: 'center', fontSize: 11.5, opacity: 0.7 }}>
        Works offline · অফলাইনে কাজ করে
      </div>
    </form>
  );
}
