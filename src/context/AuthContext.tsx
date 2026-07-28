import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { firebaseApp } from '../config/firebase';
import { isFirebaseConfigured } from '../config/firebaseConfig';

export interface AppUser {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  /** Masked for display in exchange listings, e.g. "j***@gmail.com". */
  maskedEmail: string | null;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  /** False when Firebase env vars are missing — auth button is disabled. */
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function maskEmail(email: string | null): string | null {
  if (!email) return null;
  const [name, domain] = email.split('@');
  if (!domain) return email;
  const visible = name.slice(0, 1);
  return `${visible}${'*'.repeat(Math.max(name.length - 1, 3))}@${domain}`;
}

function toAppUser(firebaseUser: FirebaseUser): AppUser {
  return {
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    maskedEmail: maskEmail(firebaseUser.email),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!firebaseApp) return;
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? toAppUser(firebaseUser) : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!firebaseApp) {
      console.warn(
        'Firebase is not configured — add PUBLIC_FIREBASE_* vars to .env.local',
      );
      return;
    }
    const auth = getAuth(firebaseApp);
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const signOutUser = async () => {
    if (!firebaseApp) return;
    await signOut(getAuth(firebaseApp));
  };

  const value: AuthContextValue = {
    user,
    loading,
    isConfigured: isFirebaseConfigured,
    signInWithGoogle,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
