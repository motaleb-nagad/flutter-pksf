import { useAppStore } from '../store/useAppStore';
import { PortalLogin } from './PortalLogin';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Dashboard } from './sections/Dashboard';
import { Beneficiaries } from './sections/Beneficiaries';
import { Indicators } from './sections/Indicators';
import { Workers } from './sections/Workers';

/** Supervisor web portal: login gate → sidebar + section content. */
export function Portal() {
  const adminLoggedIn = useAppStore((s) => s.adminLoggedIn);
  const section = useAppStore((s) => s.portalSection);

  if (!adminLoggedIn) return <PortalLogin />;

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        background: 'var(--c-portal-bg)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, overflow: 'auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        {section === 'dashboard' && <Dashboard />}
        {section === 'beneficiaries' && <Beneficiaries />}
        {section === 'indicators' && <Indicators />}
        {section === 'workers' && <Workers />}
      </div>
    </div>
  );
}
