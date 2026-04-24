import PageHeader from "../shared/PageHeader"
import MetricCard from "./components/MetricCard"
import LineChartCard from "./components/LineChartCard"
import CircleChartCard from "./components/CircleChartCard"
import ProvinceChartCard from "./components/ProvinceChartCard"
import ZodiacChartCard from "./components/ZodiacChartCard"
import ActivityFeedCard from "./components/ActivityFeedCard"
import {
  genderDistribution,
  messageTrend,
  primaryMetrics,
  profileCompletion,
  provinces,
  recentActivities,
  secondaryMetrics,
  zodiacDistribution,
} from "./homeData"

function HomeOverview() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      <PageHeader title="ภาพรวมระบบ" description="สถิติและข้อมูลการใช้งานระบบ LINE ดูดวง" />

      <section className="mt-8 grid gap-5 xl:grid-cols-4">
        {primaryMetrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_1.2fr_1.15fr]">
        {secondaryMetrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.65fr]">
        <LineChartCard data={messageTrend} title="จำนวนข้อความรายวัน" />
        <CircleChartCard title="โปรไฟล์สมบูรณ์ vs ไม่สมบูรณ์" slices={profileCompletion} donut />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        <CircleChartCard title="การกระจายตามเพศ" slices={genderDistribution} />
        <ProvinceChartCard title="Top 5 จังหวัดเกิด" data={provinces} />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <ZodiacChartCard title="การกระจายตามราศี" data={zodiacDistribution} />
        <ActivityFeedCard title="กิจกรรมล่าสุด" items={recentActivities} />
      </section>
    </div>
  )
}

export default HomeOverview
