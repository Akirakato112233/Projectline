function buildGradient(slices) {
  let start = 0

  return `conic-gradient(${slices
    .map((slice) => {
      const end = start + slice.value
      const part = `${slice.color} ${start}% ${end}%`
      start = end
      return part
    })
    .join(", ")})`
}

function CircleChartCard({ title, slices, donut = false }) {
  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">{title}</h2>

      <div className="mt-6 flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
        <div className="flex flex-wrap justify-center gap-6 lg:max-w-[42%] lg:justify-start">
          {slices.map((slice) => (
            <div key={slice.label} className="text-base font-semibold" style={{ color: slice.color }}>
              {slice.label} {slice.value}%
            </div>
          ))}
        </div>

        <div className="relative flex items-center justify-center">
          <div
            className="h-40 w-40 rounded-full border border-white/80"
            style={{ background: buildGradient(slices) }}
          />
          {donut ? <div className="absolute h-14 w-14 rounded-full bg-slate-800" /> : null}
        </div>
      </div>
    </article>
  )
}

export default CircleChartCard
