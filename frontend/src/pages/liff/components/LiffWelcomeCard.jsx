
const formatThaiDate = (dateString) => {
  if (!dateString) return "-"

  const date = new Date(`${dateString}T00:00:00`)

  if (Number.isNaN(date.getTime())) return dateString

  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

function LiffWelcomeCard({ profile, userData, primaryButtonLabel, onOpenForm }) {
  return (
    <div className="rounded-2xl border border-[rgba(212,175,55,0.3)] bg-[rgba(45,27,78,0.6)] p-6 shadow-2xl shadow-[#8b5cf6]/20 backdrop-blur-xl md:p-8">
      <div className="flex flex-col items-center text-center">
        {profile?.pictureUrl ? (
          <img
            src={profile.pictureUrl}
            alt={profile.displayName || "LINE user"}
            className="h-24 w-24 rounded-full border-4 border-[rgba(212,175,55,0.35)] object-cover shadow-lg shadow-black/30"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[rgba(212,175,55,0.35)] bg-[rgba(26,11,46,0.8)] text-3xl font-bold text-[#d4af37]">
            {(profile?.displayName || "L").slice(0, 1)}
          </div>
        )}

        <h2 className="mt-5 text-2xl font-semibold">
          สวัสดี {profile?.displayName || "ผู้ใช้งาน LINE"}
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-[#ddd6fe]">
          {userData
            ? "เราเจอข้อมูลของคุณในระบบแล้ว คุณสามารถตรวจสอบหรือแก้ไขข้อมูลวันเกิดได้จากหน้านี้"
            : "กรอกข้อมูลพื้นฐานของคุณเพื่อใช้คำนวณดวงชะตาและเตรียมข้อมูลสำหรับการทำนาย"}
        </p>

        {userData ? (
          <div className="mt-5 w-full rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(26,11,46,0.45)] p-4 text-left">
            <div className="text-sm text-[#d4af37]">ข้อมูลปัจจุบัน</div>
            <div className="mt-3 space-y-2 text-sm text-[#f5f5dc]">
              <div>ชื่อ: {userData.full_name || "-"}</div>
              <div>วันเกิด: {formatThaiDate(userData.birth_date)}</div>
              <div>เวลาเกิด: {userData.birth_time ? String(userData.birth_time).slice(0, 5) : "-"}</div>
              <div>จังหวัดเกิด: {userData.birth_place || "-"}</div>
              <div>เพศ: {userData.gender || "-"}</div>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onOpenForm}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#d4af37] to-[#fbbf24] px-4 py-4 text-base font-semibold text-[#1a0b2e] transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-[#d4af37]/40 active:scale-[0.99]"
        >
          {primaryButtonLabel}
        </button>
      </div>
    </div>
  )
}

export default LiffWelcomeCard
