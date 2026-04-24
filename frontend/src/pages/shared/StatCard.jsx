import { TrendingDown, TrendingUp } from "lucide-react"

function StatCard({ title, value, icon: Icon, iconClass, trend, trendValue }) {
  return (
    <article className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon className="h-6 w-6" />
        </div>

        {trendValue ? (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend === "down" ? "text-rose-400" : "text-emerald-400"
            }`}
          >
            {trend === "down" ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
            {trendValue}
          </div>
        ) : null}
      </div>

      <div className="mt-6 text-3xl font-bold text-slate-100">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{title}</div>
    </article>
  )
}

export default StatCard
