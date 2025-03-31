"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Mode = "PROVIDER" | "USER"

type ModeContextType = {
  mode: Mode
  setMode: (mode: Mode) => void
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // Initialize the mode from localStorage, defaulting to "USER"
   const [mode, setMode] = useState<Mode>(() => {
     if (typeof window !== "undefined") {
       const storedMode = localStorage.getItem("mode") as Mode | null
       return storedMode ?? "USER"
     }
     return "USER"
   })

  // Persist the mode change to localStorage
  useEffect(() => {
     localStorage.setItem("mode", mode)
   }, [mode])
 
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
