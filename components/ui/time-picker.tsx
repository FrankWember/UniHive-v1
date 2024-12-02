"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null)
  const hourRef = React.useRef<HTMLInputElement>(null)
  const [hour, setHour] = React.useState(date ? date.getHours() : 0)
  const [minute, setMinute] = React.useState(date ? date.getMinutes() : 0)
  const [meridiem, setMeridiem] = React.useState<"AM" | "PM">(
    date ? (date.getHours() >= 12 ? "PM" : "AM") : "AM"
  )

  React.useEffect(() => {
    if (date) {
      setHour(date.getHours())
      setMinute(date.getMinutes())
      setMeridiem(date.getHours() >= 12 ? "PM" : "AM")
    }
  }, [date])

  const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHour = parseInt(event.target.value, 10)
    if (newHour >= 0 && newHour <= 12) {
      setHour(newHour)
      updateDate(newHour, minute, meridiem)
    }
  }

  const handleMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMinute = parseInt(event.target.value, 10)
    if (newMinute >= 0 && newMinute < 60) {
      setMinute(newMinute)
      updateDate(hour, newMinute, meridiem)
    }
  }

  const handleMeridiemChange = () => {
    const newMeridiem = meridiem === "AM" ? "PM" : "AM"
    setMeridiem(newMeridiem)
    updateDate(hour, minute, newMeridiem)
  }

  const updateDate = (hour: number, minute: number, meridiem: "AM" | "PM") => {
    const newDate = new Date()
    newDate.setHours(
      meridiem === "PM" ? (hour % 12) + 12 : hour % 12,
      minute,
      0,
      0
    )
    setDate(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {date ? date.toLocaleTimeString() : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex items-end gap-2 p-3">
          <div className="grid gap-1 text-center">
            <Label htmlFor="hours" className="text-xs">
              Hours
            </Label>
            <Input
              id="hours"
              className="w-[64px]"
              value={hour}
              onChange={handleHourChange}
              ref={hourRef}
              type="number"
              min={1}
              max={12}
            />
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="minutes" className="text-xs">
              Minutes
            </Label>
            <Input
              id="minutes"
              className="w-[64px]"
              value={minute.toString().padStart(2, "0")}
              onChange={handleMinuteChange}
              ref={minuteRef}
              type="number"
              min={0}
              max={59}
            />
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="meridiem" className="text-xs">
              AM/PM
            </Label>
            <Button
              variant="outline"
              className="w-[64px]"
              onClick={handleMeridiemChange}
            >
              {meridiem}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}