"use client"

import { useMode } from '@/contexts/mode-context'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export const ModeSwitcher = () => {
  const { mode, setMode } = useMode()
  const [isLoading, setIsLoading] = useState(false)

  const handleSwitch = () => {
    setIsLoading(true)
    const newMode = mode === "PROVIDER" ? "USER" : "PROVIDER"
    setMode(newMode)

    // Adding a small delay to show the loading state
    setTimeout(() => {
      if (newMode === "PROVIDER") {
        // Reload current page after switching to provider mode
        window.location.reload()
      } else {
        // Redirect to user service home
        window.location.href = "/home/services"
      }
    }, 1000)
  }

  return (
    <Button onClick={handleSwitch} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin stroke-red-500" />
          Switching...
        </>
      ) : (
        mode === "PROVIDER" ? "Switch to User" : "Switch to Provider"
      )}
    </Button>
  )
}