export const dateFilterOptions = [
  { id: "today", label: "วันนี้" },
  { id: "7d", label: "7 วัน" },
  { id: "30d", label: "30 วัน" },
  { id: "all", label: "ทั้งหมด" },
]

export function getDateFilterLabel(filterId) {
  const option = dateFilterOptions.find((item) => item.id === filterId)
  return option?.label || "วันนี้"
}

export function matchesKeyword(values, keyword) {
  const normalizedKeyword = keyword.trim().toLowerCase()

  if (normalizedKeyword === "") {
    return true
  }

  return values.some((value) => String(value || "").toLowerCase().includes(normalizedKeyword))
}

function getStartDate(filterId) {
  if (filterId === "all") {
    return null
  }

  const start = new Date()
  start.setHours(0, 0, 0, 0)

  if (filterId === "7d") {
    start.setDate(start.getDate() - 6)
  } else if (filterId === "30d") {
    start.setDate(start.getDate() - 29)
  }

  return start
}

export function matchesDateFilter(value, filterId) {
  const startDate = getStartDate(filterId)

  if (!startDate) {
    return true
  }

  if (!value) {
    return false
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return false
  }

  return date >= startDate
}
