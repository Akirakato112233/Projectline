import { useEffect, useState } from "react"
import { Users, CheckCircle2, AlertCircle, MessageSquare, Activity, BarChart3 } from "lucide-react"

import PageHeader from "../shared/PageHeader"
import { apiUrl } from "../../utils/api"
import MetricCard from "./components/MetricCard"
import LineChartCard from "./components/LineChartCard"
import CircleChartCard from "./components/CircleChartCard"
import ProvinceChartCard from "./components/ProvinceChartCard"
import ZodiacChartCard from "./components/ZodiacChartCard"
import ActivityFeedCard from "./components/ActivityFeedCard"

function HomeOverview() {
  const [overviewData, setOverviewData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOverview() {
      try {
        const response = await fetch(apiUrl("/api/dashboard/overview/"), {
          credentials: "include",
        })
        const data = await response.json()
        setOverviewData(data)
      } catch (error) {
        console.error("Failed to load overview:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOverview()
  }, [])

  if (loading) {
    return <div className="mx-auto max-w-[1440px] px-6 py-8 text-slate-300">Loading...</div>
  }

  if (!overviewData) {
    return <div className="mx-auto max-w-[1440px] px-6 py-8 text-rose-400">โหลดข้อมูลไม่สำเร็จ</div>
  }

  const summary = overviewData.summary

  const primaryMetrics = [
    {
      title: "ผู้ใช้งานทั้งหมด",
      value: summary.total_users,
      icon: Users,
      iconClass: "bg-blue-500/15 text-blue-400",
    },
    {
      title: "โปรไฟล์สมบูรณ์",
      value: summary.complete_profiles,
      icon: CheckCircle2,
      iconClass: "bg-emerald-500/15 text-emerald-400",
    },
    {
      title: "โปรไฟล์ไม่สมบูรณ์",
      value: summary.incomplete_profiles,
      icon: AlertCircle,
      iconClass: "bg-amber-500/15 text-amber-400",
    },
    {
      title: "คำถามวันนี้",
      value: summary.questions_today,
      icon: MessageSquare,
      iconClass: "bg-violet-500/15 text-violet-400",
    },
  ]

  const secondaryMetrics = [
    {
      title: "Dify Requests วันนี้",
      value: summary.dify_requests_today,
      icon: Activity,
      iconClass: "bg-cyan-500/15 text-cyan-400",
    },
    {
      title: "Success Rate",
      value: `${summary.success_rate}%`,
      icon: BarChart3,
      iconClass: "bg-emerald-500/15 text-emerald-400",
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      <PageHeader title="ภาพรวมระบบ" description="สถิติและข้อมูลการใช้งานระบบ LINE ดูดวง" />

      <section className="mt-8 grid gap-5 xl:grid-cols-4">
        {primaryMetrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        {secondaryMetrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.65fr]">
        <LineChartCard data={overviewData.message_trend} title="จำนวนข้อความรายวัน" />
        <CircleChartCard title="โปรไฟล์สมบูรณ์ vs ไม่สมบูรณ์" slices={overviewData.profile_completion} donut />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        <CircleChartCard title="การกระจายตามเพศ" slices={overviewData.gender_distribution} />
        <ProvinceChartCard title="Top 5 จังหวัดเกิด" data={overviewData.top_provinces} />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        <ZodiacChartCard title="การกระจายตามราศี" data={overviewData.zodiac_distribution} />
        <ActivityFeedCard title="กิจกรรมล่าสุด" items={overviewData.recent_activities} />
      </section>
    </div>
  )
}

export default HomeOverview
