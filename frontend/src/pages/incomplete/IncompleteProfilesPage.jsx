import { useEffect, useMemo, useState } from "react"

import PageHeader from "../shared/PageHeader"
import { apiUrl } from "../../utils/api"
import { matchesDateFilter, matchesKeyword } from "../../utils/dashboardFilters"
import IncompleteSummary from "./components/IncompleteSummary"
import IncompleteTable from "./components/IncompleteTable"

function IncompleteProfilesPage({ globalSearchTerm, dateFilter }) {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [sentNotifications, setSentNotifications] = useState({})
  const [noticeMessage, setNoticeMessage] = useState("")

  useEffect(() => {
    async function fetchIncompleteProfiles() {
      try {
        const response = await fetch(apiUrl("/api/users/incomplete/"), {
          credentials: "include",
        })
        const data = await response.json()
        setProfiles(data)
      } catch (error) {
        console.error("Failed to load incomplete profiles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchIncompleteProfiles()
  }, [])

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const matchesSearch = matchesKeyword(
        [profile.full_name, profile.line_user_id, ...(profile.missing_fields || [])],
        globalSearchTerm
      )
      const matchesDate = matchesDateFilter(profile.created_at, dateFilter)

      return matchesSearch && matchesDate
    })
  }, [profiles, globalSearchTerm, dateFilter])

  function handleSendReminder(profile) {
    setSentNotifications((current) => ({
      ...current,
      [profile.id]: new Date().toISOString(),
    }))

    setNoticeMessage(`ส่งแจ้งเตือนให้ ${profile.full_name || profile.line_user_id || "ผู้ใช้"} แล้ว`)
  }

  if (loading) {
    return <div className="mx-auto max-w-[1440px] px-6 py-8 text-slate-300">Loading...</div>
  }

  if (!profiles) {
    return <div className="mx-auto max-w-[1440px] px-6 py-8 text-rose-400">โหลดข้อมูลไม่สำเร็จ</div>
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      <PageHeader title="โปรไฟล์ไม่สมบูรณ์" description="ผู้ใช้ที่ยังกรอกข้อมูลไม่ครบถ้วน" />

      <IncompleteSummary count={filteredProfiles.length} />

      {noticeMessage ? (
        <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {noticeMessage}
        </div>
      ) : null}

      <IncompleteTable
        profiles={filteredProfiles}
        sentNotifications={sentNotifications}
        onSendReminder={handleSendReminder}
      />
    </div>
  )
}

export default IncompleteProfilesPage
