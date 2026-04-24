import { AlertCircle, CheckCircle2, Clock3 } from "lucide-react"

export const difyStats = [
  {
    title: "สำเร็จ",
    value: "140",
    icon: CheckCircle2,
    iconClass: "bg-emerald-500/15 text-emerald-400",
  },
  {
    title: "ล้มเหลว",
    value: "11",
    icon: AlertCircle,
    iconClass: "bg-rose-500/15 text-rose-400",
  },
  {
    title: "กำลังดำเนินการ",
    value: "5",
    icon: Clock3,
    iconClass: "bg-amber-500/15 text-amber-400",
  },
]

export const difyTabs = [
  { id: "all", label: "ทั้งหมด", count: 156 },
  { id: "success", label: "สำเร็จ", count: 140 },
  { id: "failed", label: "ล้มเหลว", count: 11 },
  { id: "pending", label: "Pending", count: 5 },
]

export const difyRequests = [
  {
    id: 1,
    user: "นภัสวรรณ ปัญญา",
    userId: "user-12",
    query: "ควรจะเปลี่ยนงานใหม่",
    status: "failed",
    responseTime: "-",
    time: "9 นาทีที่ผ่านมา",
  },
  {
    id: 2,
    user: "ปิยะ รุ่งเรือง",
    userId: "user-19",
    query: "ควรจะเปลี่ยนงานใหม่",
    status: "success",
    responseTime: "1749.50ms",
    time: "10 นาทีที่ผ่านมา",
  },
  {
    id: 3,
    user: "นิรันดร์ เจริญ",
    userId: "user-7",
    query: "ดวงการเงินเดือนนี้",
    status: "success",
    responseTime: "1403.91ms",
    time: "17 นาทีที่ผ่านมา",
  },
  {
    id: 4,
    user: "อนุชา ทองดี",
    userId: "user-31",
    query: "สุขภาพของฉันเป็นอย่างไร",
    status: "success",
    responseTime: "1528.84ms",
    time: "21 นาทีที่ผ่านมา",
  },
  {
    id: 5,
    user: "ชัยวัฒน์ สมศักดิ์",
    userId: "user-33",
    query: "จะมีโชคลาภไหม",
    status: "success",
    responseTime: "1312.63ms",
    time: "21 นาทีที่ผ่านมา",
  },
  {
    id: 6,
    user: "ธนพล ร่ำรวย",
    userId: "user-9",
    query: "ความรักของฉันจะเป็นอย่างไร",
    status: "success",
    responseTime: "1639.11ms",
    time: "25 นาทีที่ผ่านมา",
  },
]
