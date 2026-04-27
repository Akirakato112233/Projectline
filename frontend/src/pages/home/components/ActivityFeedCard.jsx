import { AlertCircle, CheckCircle2, Clock3, MessageSquare } from "lucide-react"

function formatRelativeTime(value) {
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

function getActivityStyle(item) {
  const title = item.title || ""

  if (title.includes("สำเร็จ") || title.includes("ลงทะเบียน")) {
    return {
      icon: CheckCircle2,
      iconClass: "bg-emerald-500/12 text-emerald-400",
    }
  }

  if (title.includes("ผิดพลาด") || title.includes("failed")) {
    return {
      icon: AlertCircle,
      iconClass: "bg-rose-500/12 text-rose-400",
    }
  }

  if (title.includes("ถาม") || title.includes("Dify")) {
    return {
      icon: MessageSquare,
      iconClass: "bg-violet-500/12 text-violet-400",
    }
  }

  return {
    icon: Clock3,
    iconClass: "bg-blue-500/12 text-blue-400",
  }
}

function ActivityFeedCard({ items, title }) {
  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">{title}</h2>

      <div className="mt-5 max-h-[320px] space-y-4 overflow-y-auto pr-1">
        {items.map((item, index) => {
          const style = getActivityStyle(item)
          const Icon = style.icon

          return (
            <div key={`${item.title}-${index}`} className="flex gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-medium text-slate-100">{item.title}</div>
                <div className="mt-1 text-sm text-slate-400">{formatRelativeTime(item.created_at)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default ActivityFeedCard
