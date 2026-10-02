export default function DaySwitcher({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (n: number) => void;
}) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div role="radiogroup" aria-label="Trip length" className="tactile-sm inline-flex gap-1 p-1">
      {options.map((n) => {
        const on = n === value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(n)}
            className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors sm:px-4 ${
              on ? "bg-t-accent text-t-accent-ink" : "text-t-muted hover:text-t-ink"
            }`}
          >
            {n}D
          </button>
        );
      })}
    </div>
  );
}
