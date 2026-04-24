import PageHeader from "../shared/PageHeader"
import StatCard from "../shared/StatCard"
import { astrologyStats, zodiacBars, zodiacDetails } from "./astrologyData"

function buildConicGradient(items) {
  let start = 0

  const segments = items.map((item) => {
    const value = Math.round((item.value / 32) * 100)
    const end = start + value
    const part = `${item.color} ${start}% ${end}%`
    start = end
    return part
  })

  return `conic-gradient(${segments.join(", ")})`
}

function AstrologyBarCard() {
  const maxValue = Math.max(...zodiacBars.map((item) => item.value), 1)

  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">การกระจายตามราศี</h2>
      <div className="mt-5 rounded-xl border border-slate-700/60 bg-slate-800/30 px-5 py-4">
        <div className="flex h-80 items-end gap-3">
          {zodiacBars.map((item) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
              <div className="flex h-72 w-full items-end border-b border-slate-500/60">
                <div
                  className="w-full rounded-t-xl"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <div className="text-sm text-slate-300">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function AscendantPieCard() {
  const gradient = buildConicGradient(zodiacBars)

  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">การกระจายตามลัคนา</h2>
      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="relative h-60 w-60 rounded-full border border-white/80" style={{ background: gradient }} />
        <div className="grid grid-cols-3 gap-x-8 gap-y-4 text-center">
          {zodiacBars.map((item) => (
            <div key={item.label} className="text-sm font-semibold" style={{ color: item.color }}>
              {item.label} {item.value === 3 ? "9%" : "6%"}
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function ZodiacDetailGrid() {
  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">รายละเอียดแต่ละราศี</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {zodiacDetails.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-4">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-lg font-semibold text-slate-100">{item.label}</span>
            </div>
            <div className="mt-4 text-3xl font-bold text-slate-50">{item.value}</div>
            <div className="mt-2 text-sm text-slate-500">{item.percent} ของผู้ใช้</div>
          </div>
        ))}
      </div>
    </article>
  )
}

function AstrologyDataPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      <PageHeader
        title="ข้อมูลโหราศาสตร์"
        description="สถิติและการกระจายของข้อมูลทางโหราศาสตร์"
      />

      <section className="mt-8 grid gap-5 xl:grid-cols-3">
        {astrologyStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <AstrologyBarCard />
        <AscendantPieCard />
      </section>

      <section className="mt-6">
        <ZodiacDetailGrid />
      </section>
    </div>
  )
}

export default AstrologyDataPage
