/**
 * Rarity tiers used by Panini Adrenalyn XL sets.
 * Adjust/extend this list once the official WC26 checklist and tier
 * names are published — these are the typical Adrenalyn XL tiers.
 */
export type Rarity =
  | 'base'
  | 'rare'
  | 'limited-edition'
  | 'star-player'
  | 'fans-favourite';

export interface Card {
  /** Stable unique id, e.g. "arg-messi-star" — used as the collection key. */
  id: string;
  number?: number;
  team: string;
  playerName: string;
  rarity: Rarity | string;
  image?: string;
}

/** How many copies of a card a user owns. 0 = not owned, 2+ = has duplicates. */
export interface CollectionEntry {
  cardId: string;
  count: number;
}

/** Keyed by card id for O(1) lookups while rendering the grid. */
export type CollectionState = Record<string, CollectionEntry>;

export type StatusFilter = 'all' | 'missing' | 'owned' | 'duplicates';

export function matchesStatusFilter(
  count: number,
  filter: StatusFilter,
): boolean {
  switch (filter) {
    case 'missing':
      return count === 0;
    case 'owned':
      return count >= 1;
    case 'duplicates':
      return count >= 2;
    case 'all':
    default:
      return true;
  }
}
