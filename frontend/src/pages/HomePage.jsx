import { useEffect, useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"
import { apiUrl } from "../utils/api"
import AstrologyDataPage from "./astrology/AstrologyDataPage"
import DifyRequestsPage from "./dify/DifyRequestsPage"
import HomeOverview from "./home/HomeOverview"
import IncompleteProfilesPage from "./incomplete/IncompleteProfilesPage"
import SystemLogsPage from "./logs/SystemLogsPage"
import TarotAnalyticsPage from "./tarot/TarotAnalyticsPage"
import UsersPage from "./users/UsersPage"

const viewTitles = {
  overview: "ภาพรวม",
  users: "ผู้ใช้งาน",
  incomplete: "โปรไฟล์ไม่สมบูรณ์",
  dify: "Dify Requests",
  astrology: "ข้อมูลโหราศาสตร์",
  tarot: "ข้อมูลไพ่ทาโร่",
  logs: "System Logs",
}

function PlaceholderPage({ title }) {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8"> 
      <div className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-6">
        <h1 className="text-2xl font-bold text-slate-50">{title}</h1>
        <p className="mt-2 text-base text-slate-400">หน้านี้ยังไม่ได้เปิดใช้งาน</p>
      </div>
    </div>
  )
}

function HomePage({ currentUser, onLogout }) {
  const [activeView, setActiveView] = useState("overview")
  const [refreshKey, setRefreshKey] = useState(0)
  const [healthSummary, setHealthSummary] = useState(null)
  const [globalSearchTerm, setGlobalSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("today")

  useEffect(() => {
    async function fetchHealthSummary() {
      try {
        const response = await fetch(apiUrl("/api/health/"), {
          credentials: "include",
        })
        const data = await response.json()
        setHealthSummary(data)
      } catch (error) {
        console.error("Failed to load health summary:", error)
      }
    }

    fetchHealthSummary()
  }, [refreshKey])

  const handleRefresh = () => {
    setRefreshKey((current) => current + 1)
  }

  const handleViewChange = (nextView) => {
    setActiveView(nextView)
    setGlobalSearchTerm("")
  }

  const searchPlaceholders = {
    overview: "ค้นหาข้อมูลจากหน้าปัจจุบัน...",
    users: "ค้นหาผู้ใช้, LINE ID, ราศี...",
    incomplete: "ค้นหาโปรไฟล์ไม่สมบูรณ์ หรือข้อมูลที่ขาด...",
    dify: "ค้นหา request, ผู้ใช้, คำถาม...",
    astrology: "ค้นหาข้อมูลจากหน้าปัจจุบัน...",
    tarot: "ค้นหาข้อมูลจากหน้าปัจจุบัน...",
    logs: "ค้นหา log, error, LINE ID...",
  }

  const activePage =
    activeView === "overview" ? (
      <HomeOverview />
    ) : activeView === "users" ? (
      <UsersPage globalSearchTerm={globalSearchTerm} dateFilter={dateFilter} />
    ) : activeView === "incomplete" ? (
      <IncompleteProfilesPage globalSearchTerm={globalSearchTerm} dateFilter={dateFilter} />
    ) : activeView === "dify" ? (
      <DifyRequestsPage globalSearchTerm={globalSearchTerm} dateFilter={dateFilter} />
    ) : activeView === "astrology" ? (
      <AstrologyDataPage />
    ) : activeView === "tarot" ? (
      <TarotAnalyticsPage />
    ) : activeView === "logs" ? (
      <SystemLogsPage globalSearchTerm={globalSearchTerm} dateFilter={dateFilter} />
    ) : (
      <PlaceholderPage title={viewTitles[activeView] ?? "Dashboard"} />
    )

  return (
    <DashboardLayout
      activeView={activeView}
      currentUser={currentUser}
      healthSummary={healthSummary}
      onLogout={onLogout}
      onRefresh={handleRefresh}
      searchTerm={globalSearchTerm}
      onSearchChange={setGlobalSearchTerm}
      searchPlaceholder={searchPlaceholders[activeView] || "ค้นหา..."}
      dateFilter={dateFilter}
      onDateFilterChange={setDateFilter}
      onViewChange={handleViewChange}
    >
      <div key={`${activeView}-${refreshKey}`}>{activePage}</div>
    </DashboardLayout>
  )
}

export default HomePage
