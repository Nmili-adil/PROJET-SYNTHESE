export default function Loading({ rows = 5, cols = 4 }) {
  return (
    <div className="w-full animate-pulse">
      {/* Header */}
      <div className="flex gap-4 px-4 py-3 border-b border-slate-200 dark:border-slate-700/50 mb-1">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded-md bg-slate-200 dark:bg-slate-700"
            style={{ flex: i === 0 ? "0 0 28px" : 1, maxWidth: i === cols - 1 ? "90px" : undefined }}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="flex gap-4 px-4 py-3.5 border-b border-slate-100 dark:border-slate-700/25"
          style={{ opacity: 1 - row * 0.1 }}
        >
          {Array.from({ length: cols }).map((_, col) => (
            <div
              key={col}
              className={`h-3.5 rounded-md ${
                col === 0
                  ? "bg-slate-150 dark:bg-slate-700/60 flex-none w-7"
                  : col === cols - 1
                  ? "bg-slate-100 dark:bg-slate-700/35 flex-none w-20"
                  : "bg-slate-100 dark:bg-slate-700/45 flex-1"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

