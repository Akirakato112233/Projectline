import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Users,
} from "lucide-react"

export const primaryMetrics = [
  {
    title: "ผู้ใช้งานทั้งหมด",
    value: "47",
    change: "12%",
    trend: "up",
    icon: Users,
    iconClass: "bg-blue-500/15 text-blue-400",
  },
  {
    title: "โปรไฟล์สมบูรณ์",
    value: "32",
    change: "8%",
    trend: "up",
    icon: CheckCircle2,
    iconClass: "bg-emerald-500/15 text-emerald-400",
  },
  {
    title: "โปรไฟล์ไม่สมบูรณ์",
    value: "15",
    change: "5%",
    trend: "down",
    icon: AlertCircle,
    iconClass: "bg-amber-500/15 text-amber-400",
  },
  {
    title: "คำถามวันนี้",
    value: "102",
    change: "15%",
    trend: "up",
    icon: MessageSquare,
    iconClass: "bg-violet-500/15 text-violet-400",
  },
]

export const secondaryMetrics = [
  {
    title: "Dify Requests ทั้งหมด",
    value: "156",
    change: "",
    trend: "flat",
    icon: Activity,
    iconClass: "bg-cyan-500/15 text-cyan-400",
  },
  {
    title: "Success Rate",
    value: "89.7%",
    change: "3%",
    trend: "up",
    icon: BarChart3,
    iconClass: "bg-emerald-500/15 text-emerald-400",
  },
  {
    title: "Avg Response Time",
    value: "1343ms",
    change: "7%",
    trend: "down",
    icon: Clock3,
    iconClass: "bg-blue-500/15 text-blue-400",
  },
]

export const messageTrend = [
  { label: "18 เม.ย.", value: 16 },
  { label: "19 เม.ย.", value: 19 },
  { label: "20 เม.ย.", value: 21 },
  { label: "21 เม.ย.", value: 36 },
  { label: "22 เม.ย.", value: 38 },
  { label: "23 เม.ย.", value: 26 },
  { label: "24 เม.ย.", value: 32 },
]

export const profileCompletion = [
  { label: "สมบูรณ์", value: 68, color: "#1cc08a" },
  { label: "ไม่สมบูรณ์", value: 32, color: "#f59e0b" },
]

export const genderDistribution = [
  { label: "ชาย", value: 35, color: "#3b82f6" },
  { label: "หญิง", value: 33, color: "#ec4899" },
  { label: "อื่นๆ", value: 33, color: "#8b5cf6" },
]

export const provinces = [
  { label: "กรุงเทพมหานคร", value: 5 },
  { label: "เชียงใหม่", value: 4 },
  { label: "ขอนแก่น", value: 4 },
  { label: "นครราชสีมา", value: 4 },
  { label: "สงขลา", value: 4 },
]

export const zodiacDistribution = [
  { label: "พฤษภ", value: 3 },
  { label: "กรกฎ", value: 3 },
  { label: "กันย์", value: 3 },
  { label: "พิจิก", value: 3 },
  { label: "มกร", value: 2 },
  { label: "มีน", value: 2 },
]

export const recentActivities = [
  {
    title: "ผู้ใช้ใหม่: สมชาย ใจดี ลงทะเบียนเข้าระบบ",
    time: "ประมาณ 1 นาทีที่ผ่านมา",
    icon: Users,
    iconClass: "bg-blue-500/15 text-blue-400",
  },
  {
    title: "สมหญิง รักดี อัปเดตข้อมูลโปรไฟล์",
    time: "30 นาทีที่ผ่านมา",
    icon: CheckCircle2,
    iconClass: "bg-emerald-500/15 text-emerald-400",
  },
  {
    title: 'วิชัย สุขสันต์ ถามคำถาม: "ความรักของฉันจะเป็นอย่างไร"',
    time: "ประมาณ 1 ชั่วโมงที่ผ่านมา",
    icon: MessageSquare,
    iconClass: "bg-violet-500/15 text-violet-400",
  },
  {
    title: "ข้อผิดพลาด: Dify API connection timeout",
    time: "ประมาณ 2 ชั่วโมงที่ผ่านมา",
    icon: AlertCircle,
    iconClass: "bg-rose-500/15 text-rose-400",
  },
  {
    title: "ได้รับ webhook จาก LINE: Uup1utfol41a",
    time: "ประมาณ 2 ชั่วโมงที่ผ่านมา",
    icon: Activity,
    iconClass: "bg-cyan-500/15 text-cyan-400",
  },
  {
    title: "ผู้ใช้ใหม่: พิมพ์ใจ งามสม ลงทะเบียนเข้าระบบ",
    time: "ประมาณ 3 ชั่วโมงที่ผ่านมา",
    icon: Users,
    iconClass: "bg-blue-500/15 text-blue-400",
  },
]
