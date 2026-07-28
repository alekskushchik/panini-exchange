import type { Card } from '../types/card';

interface CardTileProps {
  card: Card;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function CardTile({ card, count, onIncrement, onDecrement }: CardTileProps) {
  const owned = count > 0;
  const cardNumber = card.number || parseInt(card.id.split('-')[1], 10) || 0;
  const imageSrc = import.meta.env.DEV
    ? card.image?.replace(/^\/panini-exchange\//, '/')
    : card.image;

  return (
    <div
      className={`card-tile card-tile--${card.rarity}${
        owned ? ' is-owned' : ' is-missing'
      }`}
    >
      <button
        className="card-tile__button"
        onClick={onIncrement}
        aria-label={`Додати картку: ${card.playerName}`}
      >
        <div className="card-tile__image-wrapper">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={card.playerName}
              className="card-tile__image"
            />
          ) : (
            <div
              className="card-tile__image"
              style={{
                backgroundImage: `linear-gradient(135deg, var(--rarity-${card.rarity === 'base' ? 'base' : card.rarity}), rgba(0,0,0,0.8))`,
              }}
            />
          )}

          <div className="card-tile__number">{cardNumber}</div>

          <div className="card-tile__content">
            <div className="card-tile__title">{card.playerName}</div>
            <div className="card-tile__category">{card.team}</div>
          </div>
        </div>
      </button>

      <div className="card-tile__controls">
        <button
          className="card-tile__btn-control"
          onClick={onDecrement}
          aria-label={`Прибрати картку: ${card.playerName}`}
          disabled={!owned}
        >
          −
        </button>
        {count > 0 && <span className="card-tile__count">+{count}</span>}
        <button
          className="card-tile__btn-control"
          onClick={onIncrement}
          aria-label={`Додати картку: ${card.playerName}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
