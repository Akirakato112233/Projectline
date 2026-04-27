import { useEffect, useMemo, useState } from "react"
import { Sparkles, Stars } from "lucide-react"

import PageHeader from "../shared/PageHeader"
import StatCard from "../shared/StatCard"
import { apiUrl } from "../../utils/api"

const chartColors = [
  "#1cc08a",
  "#3b82f6",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#14b8a6",
  "#a855f7",
  "#ef4444",
  "#84cc16",
  "#6366f1",
]

function buildConicGradient(items) {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  if (total === 0) {
    return "conic-gradient(#1e293b 0% 100%)"
  }

  let start = 0

  return `conic-gradient(${items
    .map((item) => {
      const partSize = (item.value / total) * 100
      const end = start + partSize
      const part = `${item.color} ${start}% ${end}%`
      start = end
      return part
    })
    .join(", ")})`
}

function addColors(items) {
  return items.map((item, index) => ({
    ...item,
    color: chartColors[index % chartColors.length],
  }))
}

function AstrologyBarCard({ items }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1)

  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">การกระจายตามราศี</h2>
      <div className="mt-5 rounded-xl border border-slate-700/60 bg-slate-800/30 px-5 py-4">
        <div className="flex h-80 items-end gap-3">
          {items.map((item) => (
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

function AscendantPieCard({ items }) {
  const gradient = buildConicGradient(items)

  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">การกระจายตามลัคนา</h2>
      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="relative h-60 w-60 rounded-full border border-white/80" style={{ background: gradient }} />
        <div className="grid grid-cols-3 gap-x-8 gap-y-4 text-center">
          {items.map((item) => (
            <div key={item.label} className="text-sm font-semibold" style={{ color: item.color }}>
              {item.label} {item.value}
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function ZodiacDetailGrid({ items }) {
  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">รายละเอียดแต่ละราศี</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-4">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-lg font-semibold text-slate-100">{item.label}</span>
            </div>
            <div className="mt-4 text-3xl font-bold text-slate-50">{item.value}</div>
            <div className="mt-2 text-sm text-slate-500">{item.percent}% ของผู้ใช้</div>
          </div>
        ))}
      </div>
    </article>
  )
}

function AstrologyDataPage() {
  const [astrologyData, setAstrologyData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAstrologyData() {
      try {
        const response = await fetch(apiUrl("/api/astrology/overview/"), {
          credentials: "include",
        })
        const data = await response.json()
        setAstrologyData(data)
      } catch (error) {
        console.error("Failed to load astrology data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAstrologyData()
  }, [])

  const zodiacBars = useMemo(() => addColors(astrologyData?.zodiac_distribution || []), [astrologyData])
  const ascendantBars = useMemo(() => addColors(astrologyData?.ascendant_distribution || []), [astrologyData])
  const zodiacDetails = useMemo(() => {
    const details = astrologyData?.zodiac_details || []
    return details.map((item, index) => ({
      ...item,
      color: chartColors[index % chartColors.length],
    }))
  }, [astrologyData])

  if (loading) {
    return <div className="mx-auto max-w-[1440px] px-6 py-8 text-slate-300">Loading...</div>
  }

  if (!astrologyData) {
    return <div className="mx-auto max-w-[1440px] px-6 py-8 text-rose-400">โหลดข้อมูลไม่สำเร็จ</div>
  }

  const astrologyStats = [
    {
      title: "ราศีที่พบ",
      value: astrologyData.stats.zodiac_count,
      icon: Sparkles,
      iconClass: "bg-amber-500/15 text-amber-400",
    },
    {
      title: "ลัคนาที่พบ",
      value: astrologyData.stats.ascendant_count,
      icon: Sparkles,
      iconClass: "bg-blue-500/15 text-blue-400",
    },
    {
      title: "มีข้อมูลตำแหน่งดาว",
      value: `${astrologyData.stats.star_position_percent}%`,
      icon: Stars,
      iconClass: "bg-violet-500/15 text-violet-400",
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      <PageHeader title="ข้อมูลโหราศาสตร์" description="สถิติและการกระจายของข้อมูลทางโหราศาสตร์" />

      <section className="mt-8 grid gap-5 xl:grid-cols-3">
        {astrologyStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <AstrologyBarCard items={zodiacBars} />
        <AscendantPieCard items={ascendantBars} />
      </section>

      <section className="mt-6">
        <ZodiacDetailGrid items={zodiacDetails} />
      </section>
    </div>
  )
}

export default AstrologyDataPage
