function ProvinceChartCard({ data, title }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1)

  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">{title}</h2>

      <div className="mt-5 rounded-xl border border-slate-700/60 bg-slate-800/30 px-5 py-4">
        <div className="flex h-56 items-end gap-6">
          {data.map((item) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
              <div className="flex h-48 w-full items-end border-b border-slate-500/60">
                <div
                  className="w-full rounded-t-xl bg-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.25)]"
                  style={{ height: `${Math.max((item.value / maxValue) * 100, 12)}%` }}
                />
              </div>
              <div className="w-full text-center text-xs leading-5 text-slate-300">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

export default ProvinceChartCard
