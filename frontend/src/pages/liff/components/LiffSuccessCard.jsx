function LiffSuccessCard({ userData, onEditAgain, onClose }) {
  return (
    <div className="rounded-2xl border border-[rgba(212,175,55,0.3)] bg-[rgba(45,27,78,0.6)] p-6 text-center shadow-2xl shadow-[#8b5cf6]/20 backdrop-blur-xl md:p-8">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#fbbf24] shadow-lg shadow-[#d4af37]/30">
        <svg className="h-10 w-10 text-[#1a0b2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="mt-5 text-2xl font-semibold">บันทึกข้อมูลเรียบร้อยแล้ว</h2>
      <p className="mt-3 text-sm leading-6 text-[#ddd6fe]">
        ตอนนี้ข้อมูลวันเกิดของคุณพร้อมสำหรับใช้งานในระบบดูดวงแล้ว
      </p>

      <div className="mt-6 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(26,11,46,0.45)] p-4 text-left">
        <div className="space-y-2 text-sm text-[#f5f5dc]">
          <div>ชื่อ: {userData?.full_name || "-"}</div>
          <div>วันเกิด: {userData?.birth_date || "-"}</div>
          <div>เวลาเกิด: {userData?.birth_time ? String(userData.birth_time).slice(0, 5) : "-"}</div>
          <div>จังหวัดเกิด: {userData?.birth_place || "-"}</div>
          <div>เพศ: {userData?.gender || "-"}</div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onEditAgain}
          className="w-full rounded-xl bg-gradient-to-r from-[#d4af37] to-[#fbbf24] px-4 py-4 text-base font-semibold text-[#1a0b2e] transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-[#d4af37]/40 active:scale-[0.99]"
        >
          แก้ไขข้อมูลอีกครั้ง
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl border border-[rgba(212,175,55,0.25)] px-4 py-4 text-base font-medium text-[#d4af37] transition hover:bg-[rgba(212,175,55,0.08)]"
        >
          ปิดหน้าต่าง
        </button>
      </div>
    </div>
  )
}

export default LiffSuccessCard
