import { useMemo, useState } from "react"
import { AlertCircle, CheckCircle2, ChevronDown, Clock3 } from "lucide-react"

import PageHeader from "../shared/PageHeader"
import StatCard from "../shared/StatCard"
import { difyRequests, difyStats, difyTabs } from "./difyData"

function statusConfig(status) {
  if (status === "success") {
    return {
      label: "สำเร็จ",
      icon: CheckCircle2,
      className: "bg-emerald-500/12 text-emerald-400",
    }
  }
  if (status === "pending") {
    return {
      label: "กำลังดำเนินการ",
      icon: Clock3,
      className: "bg-amber-500/12 text-amber-400",
    }
  }
  return {
    label: "ล้มเหลว",
    icon: AlertCircle,
    className: "bg-rose-500/12 text-rose-400",
  }
}

function DifyRequestsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredRequests = useMemo(() => {
    if (activeTab === "all") {
      return difyRequests
    }
    return difyRequests.filter((item) => item.status === activeTab)
  }, [activeTab])

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      <PageHeader title="Dify Requests" description="ตรวจสอบ request ที่ส่งไปยัง Dify API" />

      <section className="mt-8 grid gap-5 xl:grid-cols-3">
        {difyStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="mt-5 rounded-xl border border-slate-700/70 bg-slate-800/85 p-1">
        <div className="flex flex-wrap gap-2">
          {difyTabs.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-xl border border-slate-700/70 bg-slate-800/90">
        <div className="grid grid-cols-[1.4fr_2fr_1.2fr_1.4fr_1.2fr] gap-6 border-b border-slate-700/70 bg-slate-900/70 px-6 py-4 text-sm font-semibold text-slate-400">
          <div>ผู้ใช้</div>
          <div>คำถาม</div>
          <div>สถานะ</div>
          <div>เวลาตอบกลับ</div>
          <button className="flex items-center justify-start gap-2 text-left text-sm font-semibold text-slate-400">
            เวลา
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div>
          {filteredRequests.map((item) => {
            const config = statusConfig(item.status)
            const StatusIcon = config.icon

            return (
              <div
                key={item.id}
                className="grid grid-cols-[1.4fr_2fr_1.2fr_1.4fr_1.2fr] gap-6 border-b border-slate-700/70 px-6 py-4 last:border-b-0"
              >
                <div>
                  <div className="text-base font-semibold text-slate-100">{item.user}</div>
                  <div className="mt-1 text-sm text-slate-500">{item.userId}</div>
                </div>
                <div className="text-base text-slate-200">{item.query}</div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${config.className}`}>
                    <StatusIcon className="h-4 w-4" />
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center text-base text-slate-200">{item.responseTime}</div>
                <div className="flex items-center text-base text-slate-300">{item.time}</div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default DifyRequestsPage
