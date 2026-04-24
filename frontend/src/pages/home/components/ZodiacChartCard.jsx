function ZodiacChartCard({ data, title }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1)

  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">{title}</h2>

      <div className="mt-6 space-y-4">
        {data.map((item) => (
          <div key={item.label} className="grid grid-cols-[56px_1fr_24px] items-center gap-4">
            <div className="text-sm text-slate-300">{item.label}</div>
            <div className="h-5 rounded-full bg-slate-700/80">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <div className="text-right text-sm text-slate-400">{item.value}</div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default ZodiacChartCard
