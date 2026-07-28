import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function AuthButton() {
  const { user, loading, isConfigured, signInWithGoogle, signOutUser } = useAuth();
  const [avatarError, setAvatarError] = useState(false);

  if (loading) {
    return <span className="auth-button auth-button--loading">…</span>;
  }

  if (!isConfigured) {
    return (
      <button
        className="auth-button"
        disabled
        title="Додай Firebase-конфіг у .env.local, щоб увімкнути вхід"
      >
        Вхід недоступний
      </button>
    );
  }

  if (user) {
    // Ensure photoURL uses HTTPS
    const avatarUrl = user.photoURL
      ? user.photoURL.startsWith('http://')
        ? user.photoURL.replace('http://', 'https://')
        : user.photoURL
      : null;

    return (
      <div className="auth-button auth-button--signed-in">
        {avatarUrl && !avatarError && (
          <img
            className="auth-avatar"
            src={avatarUrl}
            alt="Аватар користувача"
            onError={() => setAvatarError(true)}
          />
        )}
        {(!avatarUrl || avatarError) && (
          <div className="auth-avatar auth-avatar--fallback">👤</div>
        )}
        <span>{user.displayName ?? user.maskedEmail}</span>
        <button onClick={() => void signOutUser()}>Вийти</button>
      </div>
    );
  }

  return (
    <button className="auth-button" onClick={() => void signInWithGoogle()}>
      Увійти через Google
    </button>
  );
}
