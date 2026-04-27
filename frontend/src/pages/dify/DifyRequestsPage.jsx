import { useEffect, useMemo, useState } from "react"
import { AlertCircle, CheckCircle2, ChevronDown, Clock3 } from "lucide-react"

import PageHeader from "../shared/PageHeader"
import StatCard from "../shared/StatCard"
import { apiUrl } from "../../utils/api"
import { matchesDateFilter, matchesKeyword } from "../../utils/dashboardFilters"

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

function formatRelativeTime(value) {
  if (!value) {
    return "-"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  const diffMinutes = Math.max(Math.floor((Date.now() - date.getTime()) / 60000), 0)

  if (diffMinutes < 1) {
    return "เมื่อสักครู่"
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} นาทีที่ผ่านมา`
  }

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `ประมาณ ${diffHours} ชั่วโมงที่ผ่านมา`
  }

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} วันที่ผ่านมา`
}

function formatResponseTime(value) {
  if (value === null || value === undefined) {
    return "-"
  }
  return `${value}ms`
}

function DifyRequestsPage({ globalSearchTerm, dateFilter }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function fetchDifyRequests() {
      try {
        const response = await fetch(apiUrl("/api/dify-requests/"), {
          credentials: "include",
        })
        const data = await response.json()
        setRequests(data)
      } catch (error) {
        console.error("Failed to load dify requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDifyRequests()
  }, [])

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const matchesTab = activeTab === "all" ? true : item.status === activeTab
      const matchesSearch = matchesKeyword(
        [item.full_name, item.line_user_id, item.query, item.status],
        globalSearchTerm
      )
      const matchesDate = matchesDateFilter(item.created_at, dateFilter)

      return matchesTab && matchesSearch && matchesDate
    })
  }, [activeTab, requests, globalSearchTerm, dateFilter])

  const difyStats = useMemo(() => {
    const successCount = requests.filter((item) => item.status === "success").length
    const failedCount = requests.filter((item) => item.status === "failed").length
    const pendingCount = requests.filter((item) => item.status === "pending").length

    return [
      {
        title: "สำเร็จ",
        value: successCount,
        icon: CheckCircle2,
        iconClass: "bg-emerald-500/15 text-emerald-400",
      },
      {
        title: "ล้มเหลว",
        value: failedCount,
        icon: AlertCircle,
        iconClass: "bg-rose-500/15 text-rose-400",
      },
      {
        title: "กำลังดำเนินการ",
        value: pendingCount,
        icon: Clock3,
        iconClass: "bg-amber-500/15 text-amber-400",
      },
    ]
  }, [requests])

  const difyTabs = useMemo(() => {
    const successCount = requests.filter((item) => item.status === "success").length
    const failedCount = requests.filter((item) => item.status === "failed").length
    const pendingCount = requests.filter((item) => item.status === "pending").length

    return [
      { id: "all", label: "ทั้งหมด", count: requests.length },
      { id: "success", label: "สำเร็จ", count: successCount },
      { id: "failed", label: "ล้มเหลว", count: failedCount },
      { id: "pending", label: "Pending", count: pendingCount },
    ]
  }, [requests])

  if (loading) {
    return <div className="mx-auto max-w-[1440px] px-6 py-8 text-slate-300">Loading...</div>
  }

  if (!requests) {
    return <div className="mx-auto max-w-[1440px] px-6 py-8 text-rose-400">โหลดข้อมูลไม่สำเร็จ</div>
  }

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
          {filteredRequests.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-400">ไม่พบ Dify request ตามเงื่อนไขที่เลือก</div>
          ) : null}

          {filteredRequests.map((item) => {
            const config = statusConfig(item.status)
            const StatusIcon = config.icon

            return (
              <div
                key={item.id}
                className="grid grid-cols-[1.4fr_2fr_1.2fr_1.4fr_1.2fr] gap-6 border-b border-slate-700/70 px-6 py-4 last:border-b-0"
              >
                <div>
                  <div className="text-base font-semibold text-slate-100">{item.full_name || "-"}</div>
                  <div className="mt-1 text-sm text-slate-500">{item.line_user_id || "-"}</div>
                </div>
                <div className="text-base text-slate-200">{item.query}</div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${config.className}`}>
                    <StatusIcon className="h-4 w-4" />
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center text-base text-slate-200">{formatResponseTime(item.response_time_ms)}</div>
                <div className="flex items-center text-base text-slate-300">{formatRelativeTime(item.created_at)}</div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default DifyRequestsPage
