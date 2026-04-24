import { Search } from "lucide-react"

const tabs = [
  { id: "all", label: "ทั้งหมด" },
  { id: "complete", label: "สมบูรณ์" },
  { id: "incomplete", label: "ไม่สมบูรณ์" },
]

function UserFilters({ searchTerm, onSearchChange, activeFilter, onFilterChange, totalCount }) {
  return (
    <section className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="relative w-full max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="ค้นหาชื่อหรือ LINE ID..."
          className="h-10 w-full rounded-xl border border-slate-700 bg-slate-800 pl-11 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-500"
        />
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="flex rounded-xl border border-slate-700 bg-slate-800 p-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeFilter

            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-slate-300 hover:text-slate-100"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="text-sm text-slate-300">{totalCount} รายการ</div>
      </div>
    </section>
  )
}

export default UserFilters
