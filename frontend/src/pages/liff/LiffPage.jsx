import { useEffect, useState } from "react"
import liff from "@line/liff"

const LIFF_ID = "2009924979-jIX8knKN"

function LiffPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    async function initLiff() {
      try {
        await liff.init({ liffId: LIFF_ID })

        if (!liff.isLoggedIn()) {
          liff.login()
          return
        }

        const userProfile = await liff.getProfile()
        setProfile(userProfile)
      } catch (err) {
        console.error(err)
        setError("เปิด LIFF ไม่สำเร็จ")
      } finally {
        setLoading(false)
      }
    }

    initLiff()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060b1a] text-slate-200">
        Loading LIFF...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060b1a] px-6 text-rose-300">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#060b1a] px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-700/70 bg-slate-900/95 p-6">
        <h1 className="text-2xl font-bold">LIFF พร้อมใช้งาน</h1>

        {profile ? (
          <div className="mt-6 space-y-3">
            <div>
              <div className="text-sm text-slate-400">Display name</div>
              <div className="text-base font-medium">{profile.displayName}</div>
            </div>

            <div>
              <div className="text-sm text-slate-400">User ID</div>
              <div className="break-all text-sm">{profile.userId}</div>
            </div>

            <div>
              <div className="text-sm text-slate-400">Status message</div>
              <div className="text-sm">{profile.statusMessage || "-"}</div>
            </div>

            {profile.pictureUrl ? (
              <img
                src={profile.pictureUrl}
                alt={profile.displayName}
                className="mt-4 h-20 w-20 rounded-full object-cover"
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default LiffPage
