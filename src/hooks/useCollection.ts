import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, getDoc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { firebaseApp } from '../config/firebase';
import type { CollectionState } from '../types/card';

const GUEST_STORAGE_KEY = 'panini-wc26-collection:guest';
const MIGRATED_KEY_PREFIX = 'panini-wc26-migrated:';

const firestore = firebaseApp ? getFirestore(firebaseApp) : null;

/**
 * Tracks how many of each card the current user owns.
 *
 * Guests (no uid) are persisted to localStorage. Signed-in users are synced
 * in real time to a `collections/{uid}` Firestore doc, so the collection
 * follows them across devices/tabs. On first sign-in, any guest collection
 * is merged into the Firestore doc (taking the max count per card) so
 * checking cards before logging in isn't lost.
 */
export function useCollection(uid: string | null) {
  const [collection, setCollection] = useState<CollectionState>({});
  const lastSynced = useRef<string | null>(null);
  const hasReceivedSnapshot = useRef(false);

  // Guest: load from localStorage.
  useEffect(() => {
    if (uid) return;
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    setCollection(raw ? (JSON.parse(raw) as CollectionState) : {});
  }, [uid]);

  // Guest: persist to localStorage on change.
  useEffect(() => {
    if (uid) return;
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(collection));
  }, [collection, uid]);

  // Signed-in, first time only: fold any guest localStorage collection into
  // the Firestore doc, so checking cards before logging in isn't lost.
  useEffect(() => {
    if (!uid || !firestore) return;
    const migratedKey = `${MIGRATED_KEY_PREFIX}${uid}`;
    if (localStorage.getItem(migratedKey)) return;

    const guestRaw = localStorage.getItem(GUEST_STORAGE_KEY);
    const guestCollection: CollectionState = guestRaw
      ? JSON.parse(guestRaw)
      : {};

    if (Object.keys(guestCollection).length === 0) {
      localStorage.setItem(migratedKey, '1');
      return;
    }

    const ref = doc(firestore, 'collections', uid);
    void (async () => {
      const snap = await getDoc(ref);
      const cloud = (snap.data()?.entries as CollectionState | undefined) ?? {};
      const merged: CollectionState = { ...cloud };
      for (const [cardId, entry] of Object.entries(guestCollection)) {
        const cloudCount = cloud[cardId]?.count ?? 0;
        merged[cardId] = { cardId, count: Math.max(cloudCount, entry.count) };
      }
      await setDoc(ref, { entries: merged });
      localStorage.setItem(migratedKey, '1');
    })();
  }, [uid]);

  // Signed-in: subscribe to real-time Firestore updates.
  useEffect(() => {
    if (!uid || !firestore) return;
    hasReceivedSnapshot.current = false;
    const unsubscribe = onSnapshot(doc(firestore, 'collections', uid), (snap) => {
      const data = (snap.data()?.entries as CollectionState | undefined) ?? {};
      lastSynced.current = JSON.stringify(data);
      hasReceivedSnapshot.current = true;
      setCollection(data);
    });
    return unsubscribe;
  }, [uid]);

  // Signed-in: push local changes to Firestore, skipping echoes of our own
  // remote updates (content-diffed, since object identity always changes).
  // Guarded by hasReceivedSnapshot so the initial empty `collection` state
  // can't race the subscription above and overwrite real Firestore data.
  useEffect(() => {
    if (!uid || !firestore || !hasReceivedSnapshot.current) return;
    const json = JSON.stringify(collection);
    if (json === lastSynced.current) return;
    lastSynced.current = json;
    void setDoc(doc(firestore, 'collections', uid), { entries: collection });
  }, [collection, uid]);

  const setCount = useCallback((cardId: string, count: number) => {
    setCollection((prev) => ({
      ...prev,
      [cardId]: { cardId, count: Math.max(0, count) },
    }));
  }, []);

  const increment = useCallback((cardId: string) => {
    setCollection((prev) => {
      const current = prev[cardId]?.count ?? 0;
      return { ...prev, [cardId]: { cardId, count: current + 1 } };
    });
  }, []);

  const decrement = useCallback((cardId: string) => {
    setCollection((prev) => {
      const current = prev[cardId]?.count ?? 0;
      return {
        ...prev,
        [cardId]: { cardId, count: Math.max(0, current - 1) },
      };
    });
  }, []);

  return { collection, increment, decrement, setCount };
}
