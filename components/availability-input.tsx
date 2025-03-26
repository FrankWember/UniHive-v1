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
import { TimePickerDemo } from "./ui/time-picker-12h-demo"
import { cn } from "@/lib/utils"
import { ClockIcon, X } from "lucide-react"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "./ui/dialog"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"

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
  const [activeDialog, setActiveDialog] = useState<string | null>(null)
  
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

  function formatTimeToLocaleString(date: Date): string {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
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
            <div key={day} className="space-y-2 items-center">
              <Label className="capitalize">{day}</Label>
              {value[day].map((slot, index) => (
                <div key={index} className="flex md:items-center gap-2">
                  <Dialog open={activeDialog === `${day}-${index}-start`} 
                    onOpenChange={(isOpen) => setActiveDialog(isOpen ? `${day}-${index}-start` : null)}
                    >     
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        {formatTimeToLocaleString(parseTimeString(slot[0]))}
                        <ClockIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="space-y-4 p-2">
                      <DialogHeader>
                        <DialogTitle>Set the Start Time</DialogTitle>
                        <DialogDescription>Give the start time for this shift (time slot) for your service.</DialogDescription>
                      </DialogHeader>
                      <div className="flex w-full justify-center">
                        <TimePickerDemo
                          date={parseTimeString(slot[0])}
                          setDate={(newDate) => {
                            if (newDate) {
                              handleTimeChange(day, index, "start", newDate)
                            }
                          }}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Confirm</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <span className="flex mx-3 md:my-3 md:mx-0 items-center">
                    <ArrowRightIcon />
                  </span>
                  <Dialog 
                    open={activeDialog === `${day}-${index}-end`}
                    onOpenChange={(isOpen) => setActiveDialog(isOpen ? `${day}-${index}-end` : null)}
                    >
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        {formatTimeToLocaleString(parseTimeString(slot[1]))}
                        <ClockIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="space-y-4 p-2">
                      <DialogHeader>
                        <DialogTitle>Set the Stop Time</DialogTitle>
                        <DialogDescription>Give the Stop time for this shift (time slot) for your service.</DialogDescription>
                      </DialogHeader>
                      <div className="flex w-full justify-center">
                        <TimePickerDemo
                          date={parseTimeString(slot[1])}
                          setDate={(newDate) => {
                            if (newDate) {
                              handleTimeChange(day, index, "end", newDate)
                            }
                          }}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Confirm</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
