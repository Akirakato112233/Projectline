import { Mail } from "lucide-react"

import CompletionBar from "./CompletionBar"

function getInitial(name) {
  if (!name) {
    return "-"
  }
  return name.trim().charAt(0)
}

function IncompleteTable({ profiles, sentNotifications, onSendReminder }) {
  return (
    <section className="mt-5 overflow-hidden rounded-xl border border-slate-700/70 bg-slate-800/90">
      <div className="grid grid-cols-[2.2fr_3.4fr_2fr_1.3fr] gap-6 border-b border-slate-700/70 bg-slate-900/70 px-6 py-4 text-sm font-semibold text-slate-400">
        <div>ผู้ใช้</div>
        <div>ข้อมูลที่ขาด</div>
        <div>ความสมบูรณ์</div>
        <div className="text-right">การกระทำ</div>
      </div>

      <div>
        {profiles.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-400">ไม่พบโปรไฟล์ที่ตรงกับคำค้นหาหรือช่วงวันที่ที่เลือก</div>
        ) : null}

        {profiles.map((profile) => (
          <div key={profile.id} className="border-b border-slate-700/70 px-6 py-4 last:border-b-0">
            <div className="grid grid-cols-[2.2fr_3.4fr_2fr_1.3fr] gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-white">
                  {getInitial(profile.full_name)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-slate-100">{profile.full_name || "-"}</div>
                  <div className="mt-1 text-sm text-slate-500">{profile.line_user_id || "-"}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {profile.missing_fields.map((field) => (
                  <span
                    key={field}
                    className="rounded-full bg-amber-500/12 px-4 py-2 text-sm font-semibold text-amber-400"
                  >
                    {field}
                  </span>
                ))}
              </div>

              <div className="flex items-center">
                <CompletionBar value={profile.completion} />
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => onSendReminder(profile)}
                  disabled={Boolean(sentNotifications[profile.id])}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/12 px-4 py-2.5 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/16 disabled:cursor-not-allowed disabled:bg-slate-700/60 disabled:text-slate-400"
                >
                  <Mail className="h-4 w-4" />
                  {sentNotifications[profile.id] ? "แจ้งเตือนแล้ว" : "ส่งแจ้งเตือน"}
                </button>
              </div>
            </div>

            {sentNotifications[profile.id] ? (
              <div className="mt-3 text-right text-xs text-slate-500">อัปเดตสถานะแจ้งเตือนแล้วสำหรับรายการนี้</div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}

export default IncompleteTable
