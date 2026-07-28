import { AuthProvider } from './context/AuthContext';
import { AuthButton } from './components/AuthButton';
import { ThemeToggle } from './components/ThemeToggle';
import { Checklist } from './components/Checklist';
import './App.css';

export function App() {
  return (
    <AuthProvider>
      <div className="app">
        <header className="app__header">
          <h1>Panini Adrenalyn XL WC26 — чекліст</h1>
          <div className="app__header-actions">
            <ThemeToggle />
            <AuthButton />
          </div>
        </header>
        <main>
          <Checklist />
        </main>
      </div>
    </AuthProvider>
  );
}
