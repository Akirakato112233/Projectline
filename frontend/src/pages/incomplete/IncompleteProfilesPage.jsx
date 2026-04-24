import PageHeader from "../shared/PageHeader"
import IncompleteSummary from "./components/IncompleteSummary"
import IncompleteTable from "./components/IncompleteTable"
import { incompleteProfiles } from "./incompleteData"

function IncompleteProfilesPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      <PageHeader title="โปรไฟล์ไม่สมบูรณ์" description="ผู้ใช้ที่ยังกรอกข้อมูลไม่ครบถ้วน" />

      <IncompleteSummary count={incompleteProfiles.length} />
      <IncompleteTable profiles={incompleteProfiles} />
    </div>
  )
}

export default IncompleteProfilesPage
