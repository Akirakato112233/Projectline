import { Sparkles, Stars } from "lucide-react"

export const astrologyStats = [
  {
    title: "ราศีที่พบ",
    value: "12",
    icon: Sparkles,
    iconClass: "bg-amber-500/15 text-amber-400",
    trend: "up",
    trendValue: "100%",
  },
  {
    title: "ลัคนาที่พบ",
    value: "12",
    icon: Sparkles,
    iconClass: "bg-blue-500/15 text-blue-400",
  },
  {
    title: "มีข้อมูลตำแหน่งดาว",
    value: "68.1%",
    icon: Stars,
    iconClass: "bg-violet-500/15 text-violet-400",
  },
]

export const zodiacBars = [
  { label: "เมษ", value: 3, color: "#1cc08a" },
  { label: "พฤษภ", value: 3, color: "#3b82f6" },
  { label: "เมถุน", value: 3, color: "#f59e0b" },
  { label: "กรกฎ", value: 3, color: "#ec4899" },
  { label: "สิงห์", value: 3, color: "#8b5cf6" },
  { label: "กันย์", value: 3, color: "#06b6d4" },
  { label: "ตุลย์", value: 3, color: "#f97316" },
  { label: "พิจิก", value: 3, color: "#14b8a6" },
  { label: "ธนู", value: 2, color: "#a855f7" },
  { label: "มกร", value: 2, color: "#ef4444" },
  { label: "กุมภ์", value: 2, color: "#84cc16" },
  { label: "มีน", value: 2, color: "#6366f1" },
]

export const zodiacDetails = zodiacBars.map((item) => ({
  ...item,
  percent: item.value === 3 ? "6.4%" : "4.3%",
}))
