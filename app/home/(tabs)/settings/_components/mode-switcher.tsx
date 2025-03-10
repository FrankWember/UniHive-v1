"use client"

import { useMode } from '@/contexts/mode-context'
import React from 'react'
import { Button } from 'react-day-picker'

export const ModeSwitcher = () => {
    const { mode, setMode } = useMode()

    return (
        <Button onClick={() => setMode(mode === "PROVIDER" ? "USER" : "PROVIDER")}>
            {mode === "PROVIDER" ? "Swicth to User" : "Switch to Provider"}
        </Button>
    )
}
