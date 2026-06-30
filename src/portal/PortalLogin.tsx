import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Icon } from '../components/Icon';
import { CURRENT_SUPERVISOR } from '../domain/seed';

export function PortalLogin() {
  const adminLogin = useAppStore((s) => s.adminLogin);
  const [user, setUser] = useState(CURRENT_SUPERVISOR.username);
  const [pass, setPass] = useState('');

  const input = {
    width: '100%',
    boxSizing: 'border-box' as const,
    fontFamily: 'var(--font-mono)',
    fontSize: 14.5,
    padding: '12px 13px',
    border: '1px solid var(--c-border-4)',
    borderRadius: 10,
    outline: 'none',
    background: '#fff',
    color: 'var(--c-text)',
  };

  return (
    <div
      className="sc-fade"
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--c-brand-deep)',
        height: '100%',
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          adminLogin();
        }}
        style={{
          width: 380,
          maxWidth: '90%',
          background: '#fff',
          borderRadius: 16,
          padding: '34px 32px',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 6 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'var(--c-brand)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="cross" size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.1 }}>
              MCH Surveillance Portal
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--c-text-2)' }}>
              মা ও শিশু · Supervisor sign-in
            </div>
          </div>
        </div>
        <div style={{ marginTop: 22 }}>
          <label style={{ fontSize: 12.5, color: 'var(--c-text-2)', marginBottom: 6, display: 'block' }}>
            Username · ইউজারনেম
          </label>
          <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="supervisor ID" style={input} />
          <label style={{ fontSize: 12.5, color: 'var(--c-text-2)', margin: '15px 0 6px', display: 'block' }}>
            Password · পাসওয়ার্ড
          </label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••"
            style={input}
          />
        </div>
        <button
          type="submit"
          className="btn-reset"
          style={{
            width: '100%',
            marginTop: 22,
            cursor: 'pointer',
            background: 'var(--c-brand)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            padding: 14,
            borderRadius: 11,
          }}
        >
          Sign in · প্রবেশ
        </button>
        <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--c-text-muted)', marginTop: 13 }}>
          Authorised health officials only · {CURRENT_SUPERVISOR.upazila}
        </div>
      </form>
    </div>
  );
}
