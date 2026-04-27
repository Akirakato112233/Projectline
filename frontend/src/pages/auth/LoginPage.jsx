import { useState } from "react"
import { LockKeyhole } from "lucide-react"

function LoginPage({ onLogin }) {
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage("")

    const result = await onLogin({ password })

    if (!result.ok) {
      setErrorMessage(result.message)
    }

    setSubmitting(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060b1a] px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/70 bg-slate-900/95 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div>
          <div className="text-3xl font-bold text-slate-50">เข้าสู่ระบบ</div>
          <div className="mt-2 text-sm text-slate-400">กรอกรหัสผ่านเพื่อเข้าใช้งาน dashboard</div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">รหัสผ่าน</label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 pl-11 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-xl bg-emerald-500 text-sm font-semibold text-white transition-colors hover:bg-emerald-400 disabled:opacity-70"
          >
            {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
