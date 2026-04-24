function CompletionBar({ value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-2 w-28 rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-slate-300">{value}%</span>
    </div>
  )
}

export default CompletionBar
