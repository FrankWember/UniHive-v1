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

  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== "undefined") {
      const storedMode = localStorage.getItem("mode") as Mode | null
      return storedMode ?? "USER"
    }
    return "USER"
  })

  // Update localStorage when mode changes manually
  useEffect(() => {
    localStorage.setItem("mode", mode)
  }, [mode])

  // Automatically set mode based on session when user logs in/out
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const userRole = session.user.role as Mode
      setMode(userRole)
    }
  }, [session, status])

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
