'use client'

import React from 'react'
import { addDays, format, isSameDay, startOfWeek } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Availability, CalendarEvent, generateEvents, formatTimeRange, parseAvailability } from "@/utils/helpers/calendar-helpers"
import { Prisma } from '@prisma/client'

interface WeeklyAvailabilityCalendarProps {
  availability: Prisma.JsonValue;
}

export function WeeklyAvailabilityCalendar({ availability }: WeeklyAvailabilityCalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const events = React.useMemo(() => {
    const parsedAvailability = parseAvailability(availability);
    return generateEvents(parsedAvailability);
  }, [availability])

  const eventDates = events.map((event: CalendarEvent) => event.start)

  const unAvailableDays = []

  const renderDaySummary = (day: Date) => {
    const dayEvents = events.filter((event: CalendarEvent) => isSameDay(event.start, day))
    if (dayEvents.length === 0) return <p>Not available</p>
    return dayEvents.map((event: CalendarEvent) => (
      <Badge key={event.id} variant="secondary" className="mr-2 mb-2">
        {formatTimeRange(event.start, event.end)}
      </Badge>
    ))
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <Card className="flex-grow w-full">
        <CardHeader>
          <CardTitle>Weekly Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-full"
            modifiers={{
              available: eventDates,
            }}
            modifiersStyles={{
              available: {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              }
            }}
          />
        </CardContent>
      </Card>
      <Card className="w-full min-w-64 lg:w-64">
        <CardHeader>
          <CardTitle>Availability Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(new Date()), i)).map((day) => (
              <div key={day.toISOString()} className="mb-4">
                <h3 className="font-bold">{format(day, 'EEEE')}</h3>
                <div className="text-sm flex flex-wrap">{renderDaySummary(day)}</div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

