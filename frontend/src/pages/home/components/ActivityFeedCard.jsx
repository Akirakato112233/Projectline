function ActivityFeedCard({ items, title }) {
  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <h2 className="text-lg font-semibold text-slate-50">{title}</h2>

      <div className="mt-5 max-h-[320px] space-y-4 overflow-y-auto pr-1">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.title} className="flex gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-medium text-slate-100">{item.title}</div>
                <div className="mt-1 text-sm text-slate-400">{item.time}</div>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default ActivityFeedCard
