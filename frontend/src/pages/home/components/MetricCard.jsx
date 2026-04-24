function MetricCard({ metric }) {
  const Icon = metric.icon

  return (
    <article className="rounded-xl border border-slate-700 bg-slate-800 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${metric.iconClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-6 text-3xl font-bold text-slate-100">{metric.value}</div>
      <div className="mt-1 text-sm text-slate-400">{metric.title}</div>
    </article>
  )
}

export default MetricCard
