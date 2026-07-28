import type { StatusFilter } from '../types/card';

const OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Усі' },
  { value: 'missing', label: 'Потрібні' },
  { value: 'owned', label: 'Зібрані' },
  { value: 'duplicates', label: 'Повторки' },
];

interface StatusFilterBarProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

export function StatusFilterBar({ value, onChange }: StatusFilterBarProps) {
  return (
    <div className="status-filter" role="tablist" aria-label="Фільтр за статусом">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={value === opt.value}
          className={`status-filter__btn${
            value === opt.value ? ' is-active' : ''
          }`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
