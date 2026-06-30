import { useAppStore } from '../store/useAppStore';
import { LoginScreen } from './LoginScreen';
import { HomeScreen } from './HomeScreen';
import { ListScreen } from './ListScreen';
import { RegisterScreen } from './RegisterScreen';
import { VisitScreen } from './VisitScreen';
import { ChildScreen } from './ChildScreen';
import { ProfileScreen } from './ProfileScreen';
import { BottomNav } from './BottomNav';

/** The offline field-officer mobile app: login gate → screen + persistent nav. */
export function FieldApp() {
  const loggedIn = useAppStore((s) => s.loggedIn);
  const screen = useAppStore((s) => s.screen);

  if (!loggedIn) return <LoginScreen />;

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        background: 'var(--c-app-bg)',
      }}
    >
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {screen === 'home' && <HomeScreen />}
        {screen === 'list' && <ListScreen />}
        {screen === 'register' && <RegisterScreen />}
        {screen === 'visit' && <VisitScreen />}
        {screen === 'child' && <ChildScreen />}
        {screen === 'profile' && <ProfileScreen />}
      </div>
      <BottomNav />
    </div>
  );
}
