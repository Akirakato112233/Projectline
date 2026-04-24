import { useMemo, useState } from "react"

import PageHeader from "../shared/PageHeader"
import UserFilters from "./components/UserFilters"
import UsersTable from "./components/UsersTable"
import { users as userRows } from "./usersData"

function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  const filteredUsers = useMemo(() => {
    return userRows.filter((user) => {
      const matchesFilter =
        activeFilter === "all" ? true : user.status === activeFilter

      const keyword = searchTerm.trim().toLowerCase()
      const matchesSearch =
        keyword === ""
          ? true
          : user.name.toLowerCase().includes(keyword) ||
            user.lineId.toLowerCase().includes(keyword)

      return matchesFilter && matchesSearch
    })
  }, [activeFilter, searchTerm])

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

      <UsersTable users={filteredUsers} />
    </div>
  )
}

export default UsersPage
