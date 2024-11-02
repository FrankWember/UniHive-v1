"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const minuteOptions = Array.from({ length: 4 }, (_, i) => i * 15)
    .map((minute) => ({ value: minute.toString().padStart(2, '0'), label: minute.toString().padStart(2, '0') }))

  const handleHourChange = (hour: string) => {
    if (!date) return
    const newDate = new Date(date)
    newDate.setHours(parseInt(hour))
    setDate(newDate)
  }

  const handleMinuteChange = (minute: string) => {
    if (!date) return
    const newDate = new Date(date)
    newDate.setMinutes(parseInt(minute))
    setDate(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex items-center space-x-2 p-3">
          <Select onValueChange={handleHourChange} value={date ? date.getHours().toString() : undefined}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent className="max-h-[40vh]">
              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                <SelectItem key={hour} value={hour.toString()}>
                  {hour.toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>:</span>
          <Select onValueChange={handleMinuteChange} value={date ? (Math.floor(date.getMinutes() / 15) * 15).toString().padStart(2, '0') : undefined}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Minute" />
            </SelectTrigger>
            <SelectContent>
              {minuteOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  )
}