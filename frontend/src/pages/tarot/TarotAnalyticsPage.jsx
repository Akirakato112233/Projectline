import { useEffect, useMemo, useState } from "react"
import { BarChart3, Sparkles, Users, WandSparkles } from "lucide-react"

import PageHeader from "../shared/PageHeader"
import StatCard from "../shared/StatCard"
import { apiUrl } from "../../utils/api"

const chartColors = ["#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#22c55e"]

function TopListCard({ title, items, accentLabel }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1)

  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">{title}</h2>

      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-5 text-sm text-slate-400">
            ยังไม่มีข้อมูลเพียงพอ
          </div>
        ) : (
          items.map((item, index) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-100">{item.label}</div>
                  <div className="text-xs text-slate-500">{accentLabel}</div>
                </div>
                <div className="shrink-0 text-sm font-semibold text-slate-200">{item.value}</div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-900/90">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: chartColors[index % chartColors.length],
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  )
}

function TrendCard({ items }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1)

  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">แนวโน้มการเปิดไพ่ 7 วันล่าสุด</h2>

      <div className="mt-5 rounded-xl border border-slate-700/60 bg-slate-900/50 px-5 py-4">
        <div className="flex h-72 items-end gap-3">
          {items.map((item, index) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
              <div className="flex h-60 w-full items-end border-b border-slate-600/70">
                <div
                  className="w-full rounded-t-xl"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: chartColors[index % chartColors.length],
                  }}
                />
              </div>
              <div className="text-center text-xs text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function RecentDrawsCard({ items }) {
  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">การเปิดไพ่ล่าสุด</h2>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/60">
        <div className="grid grid-cols-[1.2fr_1.6fr_1fr] gap-3 border-b border-slate-700/60 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <div>หัวข้อ</div>
          <div>ไพ่</div>
          <div>เวลา</div>
        </div>

        {items.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-400">ยังไม่มีข้อมูลการเปิดไพ่</div>
        ) : (
          items.map((item, index) => (
            <div
              key={`${item.topic}-${item.card_name_th}-${item.created_at}-${index}`}
              className="grid grid-cols-[1.2fr_1.6fr_1fr] gap-3 border-t border-slate-800/80 px-4 py-3 text-sm text-slate-200 first:border-t-0"
            >
              <div>{item.topic}</div>
              <div className="truncate">{item.card_name_th}</div>
              <div className="text-slate-400">{item.created_at}</div>
            </div>
          ))
        )}
      </div>
    </article>
  )
}

function TarotAnalyticsPage() {
  const [tarotData, setTarotData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTarotData() {
      try {
        const response = await fetch(apiUrl("/api/tarot/overview/"), {
          credentials: "include",
        })
        const data = await response.json()
        setTarotData(data)
      } catch (error) {
        console.error("Failed to load tarot data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTarotData()
  }, [])

  const stats = useMemo(() => {
    if (!tarotData) return []

    return [
      {
        title: "ผู้ใช้ที่เปิดไพ่",
        value: tarotData.summary.unique_users,
        icon: Users,
        iconClass: "bg-violet-500/15 text-violet-400",
      },
      {
        title: "จำนวนการเปิดไพ่",
        value: tarotData.summary.total_draws,
        icon: Sparkles,
        iconClass: "bg-amber-500/15 text-amber-400",
      },
      {
        title: "ไพ่ที่ถูกเปิดแล้ว",
        value: tarotData.summary.unique_cards_drawn,
        icon: WandSparkles,
        iconClass: "bg-cyan-500/15 text-cyan-400",
      },
      {
        title: "ไพ่ทั้งหมดในระบบ",
        value: tarotData.summary.total_cards_in_system,
        icon: BarChart3,
        iconClass: "bg-emerald-500/15 text-emerald-400",
      },
    ]
  }, [tarotData])

  if (loading) {
    return <div className="mx-auto max-w-[1440px] px-6 py-8 text-slate-300">Loading...</div>
  }

  if (!tarotData) {
    return <div className="mx-auto max-w-[1440px] px-6 py-8 text-rose-400">โหลดข้อมูลไพ่ทาโร่ไม่สำเร็จ</div>
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      <PageHeader title="ข้อมูลไพ่ทาโร่" description="สรุปภาพรวมการใช้งานไพ่ทาโร่ หัวข้อยอดนิยม และไพ่ที่ออกบ่อย" />

      <section className="mt-8 grid gap-5 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <TopListCard title="หัวข้อที่ถูกถามบ่อย" items={tarotData.top_topics} accentLabel="จำนวนครั้งที่ถูกเลือก" />
        <TopListCard title="ไพ่ที่ออกบ่อย" items={tarotData.top_cards} accentLabel="จำนวนครั้งที่ถูกเปิด" />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_1fr]">
        <TrendCard items={tarotData.draw_trend} />
        <RecentDrawsCard items={tarotData.recent_draws} />
      </section>
    </div>
  )
}

export default TarotAnalyticsPage
