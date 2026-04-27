import { useState } from "react"
import { Calendar, ChevronDown, LogOut, RefreshCw, Search, User } from "lucide-react"

import { dateFilterOptions, getDateFilterLabel } from "../utils/dashboardFilters"

export function TopBar({
  currentUser,
  onLogout,
  onRefresh,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  dateFilter,
  onDateFilterChange,
}) {
  const [showDateMenu, setShowDateMenu] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-700/70 bg-slate-900 px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-2xl flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-xl border border-slate-700 bg-slate-800 pl-11 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-500"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDateMenu((current) => !current)}
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700"
          >
            <Calendar className="h-4 w-4 text-slate-400" />
            {getDateFilterLabel(dateFilter)}
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showDateMenu ? (
            <div className="absolute right-0 top-12 w-36 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-xl">
              {dateFilterOptions.map((option) => {
                const isActive = option.id === dateFilter

                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      onDateFilterChange(option.id)
                      setShowDateMenu(false)
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-emerald-500/12 text-emerald-400"
                        : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>

        <button
          onClick={onRefresh}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition-colors hover:bg-slate-700"
          title="รีเฟรช"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="ml-5 flex items-center gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500">
            <User className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-slate-100">{currentUser?.name || "Admin"}</div>
            <div className="text-xs text-slate-400">{currentUser?.role || "ผู้ดูแลระบบ"}</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700"
        >
          <LogOut className="h-4 w-4 text-slate-400" />
          ออกจากระบบ
        </button>
      </div>
    </header>
  )
}
