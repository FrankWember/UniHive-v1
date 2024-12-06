"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TimePicker } from "./ui/date-time-picker"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]

interface TimeSlot {
  start: string
  end: string
}

interface AvailabilityInputProps {
  value: Record<string, [string, string][]>
  onChange: (value: Record<string, [string, string][]>) => void
  className?: string
}

export function AvailabilityInput({
  value,
  onChange,
  className,
}: AvailabilityInputProps) {
  const [selectedDay, setSelectedDay] = useState<string>(DAYS_OF_WEEK[0])

  const handleAddTimeSlot = () => {
    const newValue = { ...value }
    if (!newValue[selectedDay]) {
      newValue[selectedDay] = []
    }
    newValue[selectedDay].push(["09-00-00", "17-00-00"])
    onChange(newValue)
  }

  const handleRemoveTimeSlot = (day: string, index: number) => {
    const newValue = { ...value }
    newValue[day].splice(index, 1)
    if (newValue[day].length === 0) {
      delete newValue[day]
    }
    onChange(newValue)
  }

  const formatTimeToString = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}-${minutes}-00`
  }

  const parseTimeString = (timeString: string): Date => {
    const [hours, minutes] = timeString.split("-")
    const date = new Date()
    date.setHours(parseInt(hours, 10))
    date.setMinutes(parseInt(minutes, 10))
    date.setSeconds(0)
    return date
  }

  const handleTimeChange = (
    day: string,
    index: number,
    type: "start" | "end",
    newDate: Date | undefined
  ) => {
    if (!newDate) return

    const newValue = { ...value }
    if (!newValue[day]) return

    const timeString = formatTimeToString(newDate)
    
    if (type === "start") {
      newValue[day][index][0] = timeString
    } else {
      newValue[day][index][1] = timeString
    }
    onChange(newValue)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex space-x-2">
        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {DAYS_OF_WEEK.map((day) => (
              <SelectItem key={day} value={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" onClick={handleAddTimeSlot}>
          Add Time Slot
        </Button>
      </div>

      <div className="space-y-4">
        {DAYS_OF_WEEK.map((day) => {
          if (!value[day]?.length) return null
          
          return (
            <div key={day} className="space-y-2">
              <Label className="capitalize">{day}</Label>
              {value[day].map((slot, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <TimePicker
                    date={parseTimeString(slot[0])}
                    onChange={(newDate) => {
                      if (newDate) {
                        handleTimeChange(day, index, "start", newDate)
                      }
                    }}
                    granularity="minute"
                  />
                  <span className="flex mx-3 items-center"><ArrowRightIcon /></span>
                  <TimePicker
                    date={parseTimeString(slot[1])}
                    onChange={(newDate) => {
                      if (newDate) {
                        handleTimeChange(day, index, "end", newDate)
                      }
                    }}
                    granularity="minute"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveTimeSlot(day, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
