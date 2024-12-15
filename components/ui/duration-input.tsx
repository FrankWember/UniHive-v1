"use client"

import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useFormField } from "@/components/ui/form"

interface DurationInputProps  {
  value: number
  onChange: (duration: number) => void
  className?: string
}

export const DurationInput = ({ value, onChange, className }: DurationInputProps) => {

    const [hours, setHours] = React.useState(() => Math.floor((value as number || 0) / 60))
    const [minutes, setMinutes] = React.useState(() => (value as number || 0) % 60)

    const updateDuration = (newHours: number, newMinutes: number) => {
      const totalMinutes = newHours * 60 + newMinutes
      onChange(totalMinutes)
    }

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHours = Math.max(0, Math.min(99, Number(e.target.value)))
      setHours(newHours)
      updateDuration(newHours, minutes)
    }

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMinutes = Math.max(0, Math.min(59, Number(e.target.value)))
      setMinutes(newMinutes)
      updateDuration(hours, newMinutes)
    }

    React.useEffect(() => {
      const newHours = Math.floor((value as number || 0) / 60)
      const newMinutes = (value as number || 0) % 60
      setHours(newHours)
      setMinutes(newMinutes)
    }, [value])

    return (
      <div className={cn("grid gap-2", className)}>
        <Label htmlFor="duration">Duration</Label>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              type="number"
              id="hours"
              value={hours}
              onChange={handleHoursChange}
              className="pr-12"
              min={0}
              max={99}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
              hrs
            </div>
          </div>
          <div className="relative flex-1">
            <Input
              type="number"
              id="minutes"
              value={minutes}
              onChange={handleMinutesChange}
              className="pr-12"
              min={0}
              max={59}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
              min
            </div>
          </div>
        </div>
      </div>
    )
  }

DurationInput.displayName = "DurationInput"

