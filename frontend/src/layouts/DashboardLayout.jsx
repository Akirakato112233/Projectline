import { Sidebar } from "../components/sidebar"
import { TopBar } from "../components/Topbar"

function DashboardLayout({
  activeView,
  currentUser,
  healthSummary,
  onLogout,
  onRefresh,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  dateFilter,
  onDateFilterChange,
  onViewChange,
  children,
}) {
  return (
    <div className="flex min-h-screen bg-[#0a1020] text-slate-100">
      <Sidebar activeView={activeView} onViewChange={onViewChange} healthSummary={healthSummary} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          currentUser={currentUser}
          onLogout={onLogout}
          onRefresh={onRefresh}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          dateFilter={dateFilter}
          onDateFilterChange={onDateFilterChange}
        />
        <main className="flex-1 bg-[#060b1a]">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
