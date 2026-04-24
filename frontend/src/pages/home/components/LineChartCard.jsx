function LineChartCard({ data, title }) {
  const width = 700
  const height = 250
  const padding = 40
  const maxValue = Math.max(...data.map((item) => item.value), 1)
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2

  const points = data.map((item, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * innerWidth
    const y = padding + ((maxValue - item.value) / maxValue) * innerHeight
    return { ...item, x, y }
  })

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ")

  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">{title}</h2>

      <div className="mt-5">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
          {[0, 10, 20, 30, 40].map((value) => {
            const y = padding + ((maxValue - value) / maxValue) * innerHeight

            return (
              <g key={value}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#334155" strokeDasharray="4 6" />
                <text x={padding - 24} y={y + 4} fill="#94a3b8" fontSize="12">
                  {value}
                </text>
              </g>
            )
          })}

          {points.map((point) => (
            <line
              key={point.label}
              x1={point.x}
              y1={padding}
              x2={point.x}
              y2={height - padding}
              stroke="#243041"
              strokeDasharray="4 6"
            />
          ))}

          <path d={path} fill="none" stroke="#11d69d" strokeWidth="3" strokeLinecap="round" />

          {points.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="4.5" fill="#11d69d" />
              <text x={point.x} y={height - 14} textAnchor="middle" fill="#94a3b8" fontSize="12">
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </article>
  )
}

export default LineChartCard
