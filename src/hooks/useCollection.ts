import { useCallback, useEffect, useState } from 'react';
import type { CollectionState } from '../types/card';

function storageKey(uid: string | null): string {
  return `panini-wc26-collection:${uid ?? 'guest'}`;
}

/**
 * Tracks how many of each card the current user owns.
 *
 * Persisted to localStorage today, keyed per user id so switching accounts
 * doesn't mix collections. Once the exchange board needs cross-device sync,
 * replace the two effects below with Firestore reads/writes (e.g. a
 * `collections/{uid}` doc) — the rest of the app only depends on the
 * `{ collection, increment, decrement, setCount }` shape, not on where it's
 * stored.
 */
export function useCollection(uid: string | null) {
  const [collection, setCollection] = useState<CollectionState>({});

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(uid));
    setCollection(raw ? (JSON.parse(raw) as CollectionState) : {});
  }, [uid]);

  useEffect(() => {
    localStorage.setItem(storageKey(uid), JSON.stringify(collection));
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
