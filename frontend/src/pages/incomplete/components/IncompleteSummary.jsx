import { AlertCircle } from "lucide-react"

function IncompleteSummary({ count }) {
  return (
    <section className="mt-8 rounded-xl border border-amber-500/40 bg-[#332217] px-5 py-5 text-amber-300">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-amber-400 text-amber-400">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div>
          <div className="text-base font-semibold">พบผู้ใช้ {count} คนที่มีข้อมูลไม่สมบูรณ์</div>
          <div className="mt-1 text-sm text-amber-200">
            ระบบไม่สามารถทำนายได้อย่างแม่นยำหากข้อมูลไม่ครบถ้วน
          </div>
        </div>
      </div>
    </section>
  )
}

export default IncompleteSummary
