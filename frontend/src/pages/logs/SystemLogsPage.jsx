import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Server,
  UserPlus,
  Webhook,
  Zap,
} from "lucide-react"

import PageHeader from "../shared/PageHeader"
import { apiUrl } from "../../utils/api"
import { matchesDateFilter, matchesKeyword } from "../../utils/dashboardFilters"

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

function formatClockTime(value) {
  if (!value) {
    return "-"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function getActivityStyle(item) {
  if (item.level === "error") {
    return {
      icon: AlertCircle,
      iconClass: "bg-rose-500/12 text-rose-400",
    }
  }

  if (item.event_type?.includes("registered")) {
    return {
      icon: UserPlus,
      iconClass: "bg-blue-500/12 text-blue-400",
    }
  }

  if (item.event_type?.includes("dify")) {
    return {
      icon: MessageSquare,
      iconClass: "bg-violet-500/12 text-violet-400",
    }
  }

  return {
    icon: CheckCircle2,
    iconClass: "bg-emerald-500/12 text-emerald-400",
  }
}

function HealthCard({ card }) {
  const Icon = card.icon

  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`mt-3 h-3 w-3 rounded-full ${card.dotClass}`} />
      </div>

      <div className="mt-5 text-xl font-semibold text-slate-50">{card.title}</div>
      <div className={`mt-2 text-base font-semibold ${card.statusClass}`}>{card.status}</div>
      <div className="mt-2 text-sm text-slate-500">{card.detail}</div>
    </article>
  )
}

function RecentErrorsCard({ items }) {
  return (
    <section className="mt-5 rounded-xl border border-rose-500/60 bg-[#2b0f1d] px-5 py-5">
      <div className="flex items-center gap-3 text-rose-400">
        <AlertCircle className="h-6 w-6" />
        <h2 className="text-lg font-semibold">ข้อผิดพลาดล่าสุด</h2>
      </div>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-xl bg-[#241827] px-4 py-4 text-sm text-slate-400">ไม่พบข้อผิดพลาดในช่วงที่เลือก</div>
        ) : null}

        {items.map((item, index) => (
          <div key={`${item.title}-${index}`} className="rounded-xl bg-[#241827] px-4 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
              <div>
                <div className="text-base font-medium text-rose-300">{item.title}</div>
                <div className="mt-1 text-sm text-slate-500">{formatRelativeTime(item.created_at)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SystemLogsPage({ globalSearchTerm, dateFilter }) {
  const [systemEvents, setSystemEvents] = useState([])
  const [webhookLogs, setWebhookLogs] = useState([])
  const [healthData, setHealthData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      try {
        const [eventsResponse, webhooksResponse, healthResponse] = await Promise.all([
          fetch(apiUrl("/api/system-events/"), {
            credentials: "include",
          }),
          fetch(apiUrl("/api/webhook-logs/"), {
            credentials: "include",
          }),
          fetch(apiUrl("/api/health/"), {
            credentials: "include",
          }),
        ])

        const [eventsData, webhooksData, healthStatus] = await Promise.all([
          eventsResponse.json(),
          webhooksResponse.json(),
          healthResponse.json(),
        ])

        setSystemEvents(eventsData)
        setWebhookLogs(webhooksData)
        setHealthData(healthStatus)
      } catch (error) {
        console.error("Failed to load logs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const filteredSystemEvents = useMemo(() => {
    return systemEvents.filter((item) => {
      const matchesSearch = matchesKeyword(
        [item.title, item.detail, item.line_user_id, item.event_type],
        globalSearchTerm
      )
      const matchesDate = matchesDateFilter(item.created_at, dateFilter)

      return matchesSearch && matchesDate
    })
  }, [systemEvents, globalSearchTerm, dateFilter])

  const recentErrors = useMemo(() => {
    return filteredSystemEvents.filter((item) => item.level === "error").slice(0, 5)
  }, [filteredSystemEvents])

  const healthCards = useMemo(() => {
    const latestWebhook = webhookLogs[0]
    const latestSystemEvent = systemEvents[0]
    const lineStatus = healthData?.line_webhook?.status === "ok"
    const difyStatus = healthData?.dify_api?.status === "ok"
    const djangoStatus = healthData?.django_backend?.status === "ok"

    return [
      {
        id: "webhook",
        title: "LINE Webhook",
        status: lineStatus ? "ทำงานปกติ" : "มีปัญหา",
        detail: healthData?.line_webhook?.detail || (latestWebhook ? `ล่าสุด: ${formatRelativeTime(latestWebhook.created_at)}` : "ยังไม่มีข้อมูล"),
        dotClass: lineStatus ? "bg-emerald-500" : "bg-rose-500",
        statusClass: lineStatus ? "text-emerald-400" : "text-rose-400",
        icon: Webhook,
        iconClass: "bg-emerald-500/15 text-emerald-400",
      },
      {
        id: "dify",
        title: "Dify API",
        status: difyStatus ? "เชื่อมต่อแล้ว" : "มีข้อผิดพลาด",
        detail: healthData?.dify_api?.detail || "ยังไม่มีข้อมูล",
        dotClass: difyStatus ? "bg-blue-500" : "bg-rose-500",
        statusClass: difyStatus ? "text-blue-400" : "text-rose-400",
        icon: Zap,
        iconClass: "bg-blue-500/15 text-blue-400",
      },
      {
        id: "backend",
        title: "Django Backend",
        status: djangoStatus ? "ทำงานปกติ" : "มีปัญหา",
        detail: healthData?.django_backend?.detail || (latestSystemEvent ? `กิจกรรมล่าสุด: ${formatRelativeTime(latestSystemEvent.created_at)}` : "ยังไม่มีข้อมูล"),
        dotClass: djangoStatus ? "bg-violet-500" : "bg-rose-500",
        statusClass: djangoStatus ? "text-violet-400" : "text-rose-400",
        icon: Server,
        iconClass: "bg-violet-500/15 text-violet-400",
      },
    ]
  }, [healthData, systemEvents, webhookLogs])

  if (loading) {
    return <div className="mx-auto max-w-[1440px] px-6 py-8 text-slate-300">Loading...</div>
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      <PageHeader title="System Logs & Health" description="สถานะระบบและบันทึกกิจกรรม" />

      <section className="mt-8 grid gap-5 xl:grid-cols-3">
        {healthCards.map((card) => (
          <HealthCard key={card.id} card={card} />
        ))}
      </section>

      <RecentErrorsCard items={recentErrors} />

      <section className="mt-5 rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
        <h2 className="text-lg font-semibold text-slate-50">Activity Logs</h2>
        <div className="mt-6 max-h-[560px] space-y-4 overflow-y-auto pr-2">
          {filteredSystemEvents.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-400">ไม่พบ activity logs ตามคำค้นหาหรือช่วงวันที่ที่เลือก</div>
          ) : null}

          {filteredSystemEvents.map((item) => {
            const style = getActivityStyle(item)
            const Icon = style.icon
            const subtitleParts = [formatRelativeTime(item.created_at)]

            if (item.line_user_id) {
              subtitleParts.push(`ID: ${item.line_user_id}`)
            }

            return (
              <div key={item.id} className="flex items-start justify-between gap-6 px-4 py-3">
                <div className="flex min-w-0 gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-medium text-slate-100">{item.title}</div>
                    <div className="mt-1 text-sm text-slate-500">{subtitleParts.join("   ")}</div>
                  </div>
                </div>
                <div className="shrink-0 text-sm text-slate-600">{formatClockTime(item.created_at)}</div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default SystemLogsPage
