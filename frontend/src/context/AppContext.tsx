'use client'

import { createContext, useEffect, useState } from "react"

type User = {
  id: number
  name: string
  email: string
  // extend if needed (e.g., roles, avatar, etc.)
}

type AppContextType = {
  token: string | null
  setToken: (token: string | null) => void
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
}

function getTokenFromCookie(): string | null {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

// Context with default values
export const AppContext = createContext<AppContextType>({
  token: null,
  setToken: () => {},
  user: null,
  setUser: () => {},
  loading: true,
})

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = getTokenFromCookie()
    if (storedToken) {
      setToken(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data: User = await res.json()
        setUser(data)
      } catch (err) {
        console.error("Failed to fetch user", err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      getUser()
    }
  }, [token])

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser, loading }}>
      {children}
    </AppContext.Provider>
  )
}
