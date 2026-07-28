/**
 * Firebase project config, read from env vars at build time.
 * Rsbuild only exposes client-side vars prefixed with PUBLIC_ — see
 * https://rsbuild.rs/guide/advanced/env-vars
 *
 * Setup:
 * 1. Create a project at https://console.firebase.google.com
 * 2. Add a Web app to it — Firebase shows you these exact values.
 * 3. Enable Authentication → Sign-in method → Google.
 * 4. Copy .env.example to .env.local and fill in the values below.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);
