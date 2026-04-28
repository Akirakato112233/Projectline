import { useEffect, useMemo, useState } from "react"
import liff from "@line/liff"

import { apiUrl } from "../../utils/api"
import LiffProfileForm from "./components/LiffProfileForm"
import LiffSuccessCard from "./components/LiffSuccessCard"
import LiffWelcomeCard from "./components/LiffWelcomeCard"

const LIFF_ID = "2009926141-ffsT1WhN"

const INITIAL_FORM = {
  full_name: "",
  birth_date: "",
  birth_time: "",
  birth_place: "",
  gender: "",
}

function normalizeUserData(data) {
  return {
    full_name: data?.full_name || "",
    birth_date: data?.birth_date || "",
    birth_time: data?.birth_time ? String(data.birth_time).slice(0, 5) : "",
    birth_place: data?.birth_place || "",
    gender: data?.gender || "",
  }
}

function LiffPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState(null)
  const [userData, setUserData] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [screen, setScreen] = useState("welcome")

  const primaryButtonLabel = useMemo(() => {
    return userData ? "แก้ไขข้อมูลของฉัน" : "เริ่มกรอกข้อมูล"
  }, [userData])

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

        const response = await fetch(
          apiUrl(`/api/liff/profile/?line_user_id=${encodeURIComponent(userProfile.userId)}`)
        )

        if (response.ok) {
          const data = await response.json()
          setUserData(data)
          setFormData(normalizeUserData(data))
        } else {
          setFormData(INITIAL_FORM)
        }
      } catch (err) {
        console.error(err)
        setError("เปิด LIFF ไม่สำเร็จ")
      } finally {
        setLoading(false)
      }
    }

    initLiff()
  }, [])

  function updateField(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setSubmitError("")

    try {
      const response = await fetch(apiUrl("/api/liff/profile/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          line_user_id: profile?.userId || "",
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setSubmitError(data.message || "บันทึกข้อมูลไม่สำเร็จ")
        return
      }

      setUserData(data)
      setFormData(normalizeUserData(data))
      setScreen("success")
    } catch (err) {
      console.error(err)
      setSubmitError("บันทึกข้อมูลไม่สำเร็จ")
    } finally {
      setSaving(false)
    }
  }

  function handleOpenForm() {
    setSubmitError("")
    setScreen("form")
  }

  function handleBackToWelcome() {
    setSubmitError("")
    setScreen("welcome")
  }

  function handleEditAgain() {
    setSubmitError("")
    setScreen("form")
  }

  function handleCloseLiff() {
    if (liff.isInClient()) {
      liff.closeWindow()
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a0b2e] px-6 text-center text-[#f5f5dc]">
        กำลังเปิด LIFF...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a0b2e] px-6 text-center text-rose-300">
        {error}
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] px-4 py-8 text-[#f5f5dc]">
      <div className="absolute inset-0 opacity-15">
        <div className="absolute left-4 top-12 h-48 w-48 rounded-full bg-[#d4af37] blur-[90px]" />
        <div className="absolute bottom-16 right-4 h-64 w-64 rounded-full bg-[#8b5cf6] blur-[110px]" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fbbf24] blur-[130px]" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 32 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-[#d4af37] opacity-70"
            style={{
              top: `${(index * 17) % 100}%`,
              left: `${(index * 29) % 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#fbbf24] shadow-lg shadow-[#d4af37]/30">
            <svg className="h-12 w-12 text-[#1a0b2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>

          <h1 className="bg-gradient-to-r from-[#d4af37] via-[#fbbf24] to-[#d4af37] bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            ดูดวงโหราศาสตร์ไทย
          </h1>
          <p className="mt-2 text-sm text-[#ddd6fe] md:text-base">
            กรอกข้อมูลวันเกิดเพื่อใช้งานระบบดูดวงของคุณ
          </p>
        </div>

        {screen === "welcome" && (
          <LiffWelcomeCard
            profile={profile}
            userData={userData}
            primaryButtonLabel={primaryButtonLabel}
            onOpenForm={handleOpenForm}
          />
        )}

        {screen === "form" && (
          <LiffProfileForm
            formData={formData}
            saving={saving}
            submitError={submitError}
            onChange={updateField}
            onSubmit={handleSubmit}
            onBack={handleBackToWelcome}
          />
        )}

        {screen === "success" && (
          <LiffSuccessCard
            userData={userData}
            onEditAgain={handleEditAgain}
            onClose={handleCloseLiff}
          />
        )}
      </div>
    </div>
  )
}

export default LiffPage
