"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type Mode = "PROVIDER" | "USER"

type ModeContextType = {
  mode: Mode
  setMode: (mode: Mode) => void
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession()
  const [mode, setMode] = useState<Mode>("USER")
  const [hasInitialized, setHasInitialized] = useState(false)

  // Sync mode with session.role or fallback to localStorage
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const userRole = session.user.role as Mode
      setMode(userRole)
      setHasInitialized(true)
    } else if (status === "unauthenticated") {
      const storedMode = localStorage.getItem("mode") as Mode | null
      setMode(storedMode ?? "USER")
      setHasInitialized(true)
    }
  }, [session, status])

  // Save mode to localStorage *after* initialization
  useEffect(() => {
    if (hasInitialized) {
      localStorage.setItem("mode", mode)
    }
  }, [mode, hasInitialized])

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export const useMode = () => {
  const context = useContext(ModeContext)
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}
