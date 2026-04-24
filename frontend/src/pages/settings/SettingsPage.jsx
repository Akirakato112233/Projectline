import { Bell, Database, KeyRound, Link2, Palette, Shield } from "lucide-react"

import PageHeader from "../shared/PageHeader"

function SettingsCard({ title, icon: Icon, iconClass, children }) {
  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-800/85 p-5">
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold text-slate-50">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </article>
  )
}

function InputBlock({ label, value, helper }) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-slate-400">{label}</div>
      <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-200">
        {value}
      </div>
      {helper ? <div className="mt-2 text-sm text-slate-500">{helper}</div> : null}
    </div>
  )
}

function ToggleRow({ label, checked }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3">
      <span className="text-base font-medium text-slate-100">{label}</span>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded ${
          checked ? "bg-rose-500 text-white" : "border border-slate-500 bg-transparent text-transparent"
        }`}
      >
        ✓
      </span>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8">
      <PageHeader title="การตั้งค่า" description="กำหนดค่าระบบและการเชื่อมต่อ" />

      <section className="mt-8 grid gap-5 xl:grid-cols-2">
        <SettingsCard title="LINE Webhook" icon={Link2} iconClass="bg-emerald-500/15 text-emerald-400">
          <div className="space-y-4">
            <InputBlock label="Webhook URL" value="https://api.example.com/webhook/line" />
            <InputBlock label="Channel Secret" value="••••••••••••••••" />
            <button className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-base font-semibold text-white">
              ทดสอบการเชื่อมต่อ
            </button>
          </div>
        </SettingsCard>

        <SettingsCard title="Dify API" icon={KeyRound} iconClass="bg-blue-500/15 text-blue-400">
          <div className="space-y-4">
            <InputBlock label="API Endpoint" value="https://api.dify.ai/v1" />
            <InputBlock label="API Key" value="••••••••••••••••••••" />
            <button className="w-full rounded-xl bg-blue-500 px-4 py-3 text-base font-semibold text-white">
              ยืนยัน API Key
            </button>
          </div>
        </SettingsCard>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <SettingsCard title="Django Backend" icon={Database} iconClass="bg-violet-500/15 text-violet-400">
          <div className="space-y-4">
            <InputBlock label="Database" value="PostgreSQL" helper="Connected: localhost:5432" />
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-400">Debug Mode</div>
              <div className="grid grid-cols-2 gap-3">
                <button className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base font-semibold text-slate-400">
                  Off
                </button>
                <button className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-base font-semibold text-emerald-400">
                  On (Development)
                </button>
              </div>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="การแจ้งเตือน" icon={Bell} iconClass="bg-amber-500/15 text-amber-400">
          <div className="space-y-3">
            <ToggleRow label="แจ้งเตือนเมื่อผู้ใช้ใหม่ลงทะเบียน" checked />
            <ToggleRow label="แจ้งเตือนเมื่อเกิด Error" checked />
            <ToggleRow label="รายงานสรุปรายวัน" checked={false} />
          </div>
        </SettingsCard>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <SettingsCard title="ความปลอดภัย" icon={Shield} iconClass="bg-rose-500/15 text-rose-400">
          <div className="space-y-4">
            <InputBlock label="Rate Limiting" value="100 requests / minute" />
            <InputBlock label="IP Whitelist" value="*.*.*.*" helper="All IPs allowed" />
          </div>
        </SettingsCard>

        <SettingsCard title="การแสดงผล" icon={Palette} iconClass="bg-pink-500/15 text-pink-400">
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-400">Theme</div>
              <div className="grid grid-cols-2 gap-3">
                <button className="rounded-xl border border-emerald-500/20 bg-slate-900 px-4 py-3 text-base font-semibold text-emerald-400">
                  Dark Mode
                </button>
                <button className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base font-semibold text-slate-400">
                  Light Mode
                </button>
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold text-slate-400">ภาษา</div>
              <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-200">
                ไทย
              </div>
            </div>
          </div>
        </SettingsCard>
      </section>

      <section className="mt-5 flex justify-end gap-3">
        <button className="rounded-xl bg-slate-700 px-6 py-3 text-base font-semibold text-slate-200">
          ยกเลิก
        </button>
        <button className="rounded-xl bg-emerald-500 px-6 py-3 text-base font-semibold text-white">
          บันทึกการตั้งค่า
        </button>
      </section>
    </div>
  )
}

export default SettingsPage
