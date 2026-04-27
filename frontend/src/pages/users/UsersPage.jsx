import { useEffect, useMemo, useState } from "react"

import PageHeader from "../shared/PageHeader"
import { apiUrl } from "../../utils/api"
import { matchesDateFilter, matchesKeyword } from "../../utils/dashboardFilters"
import UserFilters from "./components/UserFilters"
import UsersTable from "./components/UsersTable"

function formatDate(value, options) {
  if (!value) {
    return "-"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return date.toLocaleString("th-TH", options)
}

function UserDetailModal({ user, onClose }) {
  if (!user) {
    return null
  }

  const detailItems = [
    { label: "ชื่อ", value: user.full_name || "-" },
    { label: "LINE ID", value: user.line_user_id || "-" },
    { label: "วันเกิด", value: formatDate(user.birth_date, { year: "numeric", month: "long", day: "numeric" }) },
    { label: "เวลาเกิด", value: user.birth_time || "-" },
    { label: "จังหวัดเกิด", value: user.birth_place || "-" },
    { label: "เพศ", value: user.gender || "-" },
    { label: "ราศี", value: user.zodiac_sign || "-" },
    { label: "สถานะโปรไฟล์", value: user.step >= 2 ? "สมบูรณ์" : "ไม่สมบูรณ์" },
    { label: "ใช้งานล่าสุด", value: formatDate(user.last_active_at, { dateStyle: "medium", timeStyle: "short" }) },
    { label: "วันที่สร้าง", value: formatDate(user.created_at, { dateStyle: "medium", timeStyle: "short" }) },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-6">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold text-slate-50">{user.full_name || "ผู้ใช้"}</div>
            <div className="mt-2 text-sm text-slate-400">{user.line_user_id || "-"}</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700"
          >
            ปิด
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {detailItems.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-700/70 bg-slate-800/80 p-4">
              <div className="text-sm font-semibold text-slate-400">{item.label}</div>
              <div className="mt-2 text-base text-slate-100">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function UsersPage({ globalSearchTerm, dateFilter }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(apiUrl("/api/users/"), {
          credentials: "include",
        })
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Failed to load users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const status = user.step >= 2 ? "complete" : "incomplete"
      const matchesFilter = activeFilter === "all" ? true : status === activeFilter
      const matchesLocalSearch = matchesKeyword([user.full_name, user.line_user_id, user.zodiac_sign], searchTerm)
      const matchesGlobalSearch = matchesKeyword([user.full_name, user.line_user_id, user.zodiac_sign], globalSearchTerm)
      const matchesDate = matchesDateFilter(user.last_active_at || user.created_at, dateFilter)

      return matchesFilter && matchesLocalSearch && matchesGlobalSearch && matchesDate
    })
  }, [users, searchTerm, activeFilter, globalSearchTerm, dateFilter])

  if (loading) {
    return <div className="mx-auto max-w-[1440px] px-6 py-8 text-slate-300">Loading...</div>
  }

  if (!users) {
    return <div className="mx-auto max-w-[1440px] px-6 py-8 text-rose-400">โหลดข้อมูลไม่สำเร็จ</div>
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      <PageHeader title="ผู้ใช้งาน" description="จัดการและดูข้อมูลผู้ใช้งานทั้งหมด" />

      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        totalCount={filteredUsers.length}
      />

      <UsersTable users={filteredUsers} onViewDetails={setSelectedUser} />
      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  )
}

export default UsersPage
