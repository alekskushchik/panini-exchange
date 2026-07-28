interface ProgressBarProps {
  owned: number;
  total: number;
}

export function ProgressBar({ owned, total }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((owned / total) * 100);
  return (
    <div className="progress">
      <div className="progress__track">
        <div className="progress__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress__label">
        {owned}/{total}
      </span>
    </div>
  );
}
