"use client"

import { useMode } from '@/contexts/mode-context'
import React from 'react'
import { Button } from '@/components/ui/button'

export const ModeSwitcher = () => {
  const { mode, setMode } = useMode()

  const handleSwitch = () => {
    const newMode = mode === "PROVIDER" ? "USER" : "PROVIDER"
    setMode(newMode)

    setTimeout(() => {
      if (newMode === "PROVIDER") {
        // Reload current page after switching to provider mode
        window.location.reload()
      } else {
        // Redirect to user service home
        window.location.href = "/home/services"
      }
    }, 100)
  }

  return (
    <Button onClick={handleSwitch}>
      {mode === "PROVIDER" ? "Switch to User" : "Switch to Provider"}
    </Button>
  )
}
