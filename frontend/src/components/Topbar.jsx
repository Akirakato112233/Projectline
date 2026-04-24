import { Calendar, RefreshCw, Search, Settings as SettingsIcon, User } from "lucide-react"

export function TopBar({ onRefresh }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-700/70 bg-slate-900 px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-2xl flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="ค้นหาผู้ใช้, LINE ID, ชื่อ..."
            className="h-10 w-full rounded-xl border border-slate-700 bg-slate-800 pl-11 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-500"
          />
        </div>

        <button className="flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm font-medium text-slate-200">
          <Calendar className="h-4 w-4 text-slate-400" />
          วันนี้
        </button>

        <button
          onClick={onRefresh}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition-colors hover:bg-slate-700"
          title="รีเฟรช"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <button className="ml-5 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500">
          <User className="h-4.5 w-4.5 text-white" />
        </div>
        <div className="text-left">
          <div className="text-sm font-semibold text-slate-100">Admin</div>
          <div className="text-xs text-slate-400">ผู้ดูแลระบบ</div>
        </div>
        <SettingsIcon className="h-4 w-4 text-slate-500" />
      </button>
    </header>
  )
}
