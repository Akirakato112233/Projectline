import {
  FileText,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Stars,
  UserX,
  Users,
} from "lucide-react"

const menuItems = [
  { id: "overview", label: "ภาพรวม", icon: LayoutDashboard },
  { id: "users", label: "ผู้ใช้งาน", icon: Users },
  { id: "incomplete", label: "โปรไฟล์ไม่สมบูรณ์", icon: UserX },
  { id: "dify", label: "Dify Requests", icon: MessageSquare },
  { id: "astrology", label: "ข้อมูลโหราศาสตร์", icon: Stars },
  { id: "logs", label: "System Logs", icon: FileText },
]

function buildSystemStatus(healthSummary) {
  if (!healthSummary) {
    return {
      dotClass: "bg-slate-500",
      textClass: "text-slate-200",
      label: "กำลังตรวจสอบ",
      detail: "กำลังโหลดสถานะระบบ",
    }
  }

  const services = [
    healthSummary.line_webhook,
    healthSummary.dify_api,
    healthSummary.django_backend,
  ].filter(Boolean)

  const errorCount = services.filter((item) => item.status !== "ok").length

  if (errorCount === 0) {
    return {
      dotClass: "bg-emerald-500",
      textClass: "text-emerald-300",
      label: "ทำงานปกติ",
      detail: "ทุกบริการพร้อมใช้งาน",
    }
  }

  return {
    dotClass: "bg-rose-500",
    textClass: "text-rose-300",
    label: "มีปัญหา",
    detail: `${errorCount} บริการต้องตรวจสอบ`,
  }
}

export function Sidebar({ activeView, onViewChange, healthSummary }) {
  const systemStatus = buildSystemStatus(healthSummary)

  return (
    <aside className="sticky top-0 flex h-screen w-[248px] shrink-0 flex-col border-r border-slate-700/70 bg-slate-900">
      <div className="border-b border-slate-700/70 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-emerald-400 to-cyan-400">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <div className="text-xl font-semibold leading-tight text-slate-50">LINE ดูดวง</div>
            <div className="mt-1 text-sm text-slate-400">Admin Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = item.id === activeView

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <div className="px-3 py-4">
        <div className="rounded-xl bg-slate-800 px-4 py-4">
          <div className="text-sm font-semibold text-slate-300">System Status</div>
          <div className={`mt-3 flex items-center gap-2 text-sm ${systemStatus.textClass}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${systemStatus.dotClass}`} />
            {systemStatus.label}
          </div>
          <div className="mt-2 text-xs text-slate-400">{systemStatus.detail}</div>
        </div>
      </div>
    </aside>
  )
}
