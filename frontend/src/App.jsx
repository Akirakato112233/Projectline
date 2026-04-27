import { useEffect, useState } from "react"

import AuthGuard from "./components/AuthGuard"
import { apiUrl } from "./utils/api"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/auth/LoginPage"

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch(apiUrl("/api/auth/me/"), {
          credentials: "include",
        })

        if (!response.ok) {
          setCurrentUser(null)
          return
        }

        const data = await response.json()
        setCurrentUser(data.user || null)
      } catch (error) {
        console.error("Failed to check auth:", error)
        setCurrentUser(null)
      } finally {
        setCheckingAuth(false)
      }
    }

    fetchCurrentUser()
  }, [])

  async function handleLogin({ password }) {
    try {
      const response = await fetch(apiUrl("/api/auth/login/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          ok: false,
          message: data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        }
      }

      setCurrentUser(data.user)
      return { ok: true }
    } catch (error) {
      console.error("Failed to login:", error)
      return {
        ok: false,
        message: "เข้าสู่ระบบไม่สำเร็จ",
      }
    }
  }

  async function handleLogout() {
    try {
      await fetch(apiUrl("/api/auth/logout/"), {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Failed to logout:", error)
    } finally {
      setCurrentUser(null)
    }
  }

  if (checkingAuth) {
    return <div className="flex min-h-screen items-center justify-center bg-[#060b1a] text-slate-300">Loading...</div>
  }

  return (
    <AuthGuard currentUser={currentUser} fallback={<LoginPage onLogin={handleLogin} />}>
      <HomePage currentUser={currentUser} onLogout={handleLogout} />
    </AuthGuard>
  )
}

export default App
