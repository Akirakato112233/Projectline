import { useState } from "react"

import DashboardLayout from "../layouts/DashboardLayout"
import AstrologyDataPage from "./astrology/AstrologyDataPage"
import DifyRequestsPage from "./dify/DifyRequestsPage"
import HomeOverview from "./home/HomeOverview"
import IncompleteProfilesPage from "./incomplete/IncompleteProfilesPage"
import SystemLogsPage from "./logs/SystemLogsPage"
import SettingsPage from "./settings/SettingsPage"
import UsersPage from "./users/UsersPage"

const viewTitles = {
  overview: "ภาพรวม",
  users: "ผู้ใช้งาน",
  incomplete: "โปรไฟล์ไม่สมบูรณ์",
  dify: "Dify Requests",
  astrology: "ข้อมูลโหราศาสตร์",
  logs: "System Logs",
  settings: "การตั้งค่า",
}

function PlaceholderPage({ title }) {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      <div className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-6">
        <h1 className="text-2xl font-bold text-slate-50">{title}</h1>
        <p className="mt-2 text-base text-slate-400">
          ตอนนี้ผมทำหน้า Home ให้ก่อนตามภาพอ้างอิงแล้ว ส่วนหน้านี้เว้นไว้ให้ต่อยอดในขั้นถัดไป
        </p>
      </div>
    </div>
  )
}

function HomePage() {
  const [activeView, setActiveView] = useState("overview")

  const handleRefresh = () => {
    console.log("refresh dashboard")
  }

  return (
    <DashboardLayout
      activeView={activeView}
      onRefresh={handleRefresh}
      onViewChange={setActiveView}
    >
      {activeView === "overview" ? (
        <HomeOverview />
      ) : activeView === "users" ? (
        <UsersPage />
      ) : activeView === "incomplete" ? (
        <IncompleteProfilesPage />
      ) : activeView === "dify" ? (
        <DifyRequestsPage />
      ) : activeView === "astrology" ? (
        <AstrologyDataPage />
      ) : activeView === "logs" ? (
        <SystemLogsPage />
      ) : activeView === "settings" ? (
        <SettingsPage />
      ) : (
        <PlaceholderPage title={viewTitles[activeView] ?? "Dashboard"} />
      )}
    </DashboardLayout>
  )
}

export default HomePage
