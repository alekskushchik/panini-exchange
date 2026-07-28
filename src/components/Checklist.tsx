import { useMemo, useState } from 'react';
import { cardSet } from '../data/cardSet';
import { matchesStatusFilter, type StatusFilter } from '../types/card';
import { useAuth } from '../context/AuthContext';
import { useCollection } from '../hooks/useCollection';
import { CardTile } from './CardTile';
import { StatusFilterBar } from './StatusFilterBar';
import { ProgressBar } from './ProgressBar';

const ALL_TEAMS = 'all';
const CARDS_PER_PAGE = 9;

export function Checklist() {
  const { user } = useAuth();
  const { collection, increment, decrement } = useCollection(user?.uid ?? null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [teamFilter, setTeamFilter] = useState<string>(ALL_TEAMS);
  const [currentPage, setCurrentPage] = useState(1);

  const teams = useMemo(
    () => Array.from(new Set(cardSet.map((c) => c.team))).sort(),
    [],
  );

  const ownedCount = useMemo(
    () => cardSet.filter((c) => (collection[c.id]?.count ?? 0) > 0).length,
    [collection],
  );

  const visibleCards = useMemo(
    () =>
      cardSet.filter((card) => {
        const count = collection[card.id]?.count ?? 0;
        const statusOk = matchesStatusFilter(count, statusFilter);
        const teamOk = teamFilter === ALL_TEAMS || card.team === teamFilter;
        return statusOk && teamOk;
      }),
    [collection, statusFilter, teamFilter],
  );

  const totalPages = useMemo(
    () => Math.ceil(visibleCards.length / CARDS_PER_PAGE),
    [visibleCards.length],
  );

  const paginatedCards = useMemo(
    () => {
      const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
      const endIndex = startIndex + CARDS_PER_PAGE;
      return visibleCards.slice(startIndex, endIndex);
    },
    [visibleCards, currentPage],
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [statusFilter, teamFilter]);

  return (
    <section className="checklist">
      <ProgressBar owned={ownedCount} total={cardSet.length} />

      <div className="checklist__controls">
        <StatusFilterBar value={statusFilter} onChange={setStatusFilter} />
        <select
          className="team-filter"
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          aria-label="Фільтр за збірною"
        >
          <option value={ALL_TEAMS}>Усі збірні</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>

      <div className="checklist__grid">
        {paginatedCards.map((card) => (
          <CardTile
            key={card.id}
            card={card}
            count={collection[card.id]?.count ?? 0}
            onIncrement={() => increment(card.id)}
            onDecrement={() => decrement(card.id)}
          />
        ))}
      </div>

      {visibleCards.length === 0 && (
        <p className="checklist__empty">Немає карток за цим фільтром.</p>
      )}

      {totalPages > 1 && (
        <div className="checklist__pagination">
          <button
            className="pagination__btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Попередня сторінка"
          >
            ←
          </button>
          <span className="pagination__info">
            Сторінка {currentPage} з {totalPages}
          </span>
          <button
            className="pagination__btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Наступна сторінка"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
