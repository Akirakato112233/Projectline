import { CheckCircle2, ChevronDown, CircleX } from "lucide-react"

function getInitial(name) {
  return name.trim().charAt(0)
}

function statusConfig(status) {
  if (status === "complete") {
    return {
      label: "สมบูรณ์",
      className: "bg-emerald-500/12 text-emerald-400",
      icon: CheckCircle2,
    }
  }

  return {
    label: "ไม่สมบูรณ์",
    className: "bg-amber-500/12 text-amber-400",
    icon: CircleX,
  }
}

function UsersTable({ users }) {
  return (
    <section className="mt-5 overflow-hidden rounded-xl border border-slate-700/70 bg-slate-800/90">
      <div className="grid grid-cols-[2.1fr_1.7fr_1.4fr_0.8fr_2fr_1fr] gap-6 border-b border-slate-700/70 bg-slate-900/70 px-6 py-4 text-sm font-semibold text-slate-400">
        <div>ชื่อผู้ใช้</div>
        <div>LINE ID</div>
        <div>สถานะ</div>
        <div>คำถาม</div>
        <button className="flex items-center gap-2 text-left text-sm font-semibold text-slate-400">
          ใช้งานล่าสุด
          <ChevronDown className="h-4 w-4" />
        </button>
        <div className="text-right">การกระทำ</div>
      </div>

      <div>
        {users.map((user) => {
          const config = statusConfig(user.status)
          const StatusIcon = config.icon

          return (
            <div
              key={user.id}
              className="grid grid-cols-[2.1fr_1.7fr_1.4fr_0.8fr_2fr_1fr] gap-6 border-b border-slate-700/70 px-6 py-4 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-bold text-white">
                  {getInitial(user.name)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-slate-100">{user.name}</div>
                  <div className="mt-1 text-sm text-slate-400">{user.zodiac}</div>
                </div>
              </div>

              <div className="flex items-center">
                <span className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-slate-300">
                  {user.lineId}
                </span>
              </div>

              <div className="flex items-center">
                <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${config.className}`}>
                  <StatusIcon className="h-4 w-4" />
                  {config.label}
                </span>
              </div>

              <div className="flex items-center text-base font-medium text-slate-200">
                {user.questions}
              </div>

              <div className="flex items-center text-base text-slate-300">{user.lastActive}</div>

              <div className="flex items-center justify-end">
                <button className="text-sm font-semibold text-emerald-400 hover:text-emerald-300">
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default UsersTable
