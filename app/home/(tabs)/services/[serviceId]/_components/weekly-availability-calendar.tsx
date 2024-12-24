'use client'

import React, { useMemo } from 'react'
import { addDays, format, isSameDay, startOfWeek, parseISO } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Availability, CalendarEvent, generateEvents, formatTimeRange, parseAvailability } from "@/utils/helpers/calendar-helpers"
import { Prisma } from '@prisma/client'
import { Separator } from '@/components/ui/separator'
import { useIsMobile } from '@/hooks/use-mobile'

interface WeeklyAvailabilityCalendarProps {
  availability: Prisma.JsonValue;
}

type TimeSlot = [string, string];

function consolidateTimeSlots(slots: TimeSlot[]): TimeSlot[] {
  if (!slots || slots.length === 0) return [];

  // Sort slots by start time
  const sortedSlots = [...slots].sort((a, b) => a[0].localeCompare(b[0]));
  const consolidated: TimeSlot[] = [];
  let currentSlot: TimeSlot | null = null;

  for (const slot of sortedSlots) {
    if (!currentSlot) {
      currentSlot = [...slot];
      continue;
    }

    // Check if slots are consecutive
    const currentEndTime = parseISO(`1970-01-01T${currentSlot[1]}`);
    const nextStartTime = parseISO(`1970-01-01T${slot[0]}`);
    const timeDiff = (nextStartTime.getTime() - currentEndTime.getTime()) / (1000 * 60);

    if (timeDiff <= 0) {
      // Overlapping or continuous slots
      currentSlot[1] = slot[1];
    } else if (timeDiff === 15) {
      // Adjacent slots
      currentSlot[1] = slot[1];
    } else {
      // Gap between slots, create new consolidated slot
      consolidated.push([...currentSlot]);
      currentSlot = [...slot];
    }
  }

  if (currentSlot) {
    consolidated.push(currentSlot);
  }

  return consolidated;
}

function formatTime(timeString: string): string {
  const date = parseISO(`1970-01-01T${timeString}`);
  return format(date, 'h:mm a');
}

export function WeeklyAvailabilityCalendar({ availability }: WeeklyAvailabilityCalendarProps) {
  const isMobile = useIsMobile()
  
  const { events, availableDays } = useMemo(() => {
    const parsedAvailability = parseAvailability(availability);
    const events = generateEvents(parsedAvailability);
    
    // Get unique days that have availability
    const days = Object.keys(parsedAvailability || {}).filter(
      day => parsedAvailability[day as keyof Availability]?.length > 0
    );
    
    return { events, availableDays: days };
  }, [availability]);

  const eventDates = events.map((event: CalendarEvent) => event.start);

  // Function to check if a date should be disabled
  const isDateDisabled = (date: Date) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[date.getDay()];
    return !availableDays.includes(dayName);
  };

  const renderDaySummary = (day: Date) => {
    const dayEvents = events.filter((event: CalendarEvent) => isSameDay(event.start, day));
    if (dayEvents.length === 0) return <p>Not available</p>;

    // Convert events to time slots and consolidate them
    const timeSlots = dayEvents.map(event => [
      format(event.start, 'HH-mm-ss'),
      format(event.end, 'HH-mm-ss')
    ] as TimeSlot);

    const consolidatedSlots = consolidateTimeSlots(timeSlots);

    return consolidatedSlots.map((slot, index) => (
      <Badge key={index} variant="secondary" className="mr-2 mb-2">
        {`${formatTime(slot[0])} - ${formatTime(slot[1])}`}
      </Badge>
    ));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="flex-grow w-full">
          <h2 className="text-2xl font-semibold mb-2">Availability</h2>
          <Calendar
            mode="single"
            className="w-full"
            classNames={{
              day: "h-10 w-10",
              head_cell: "w-10"
            }}
            disabled={isDateDisabled}
            modifiers={{
              available: eventDates,
            }}
            modifiersStyles={{
              available: {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              }
            }}
          />
      </div>
      <Separator orientation={isMobile?"horizontal":"vertical"} />
      <div className="w-full min-w-64">
          <h2 className="text-2xl font-semibold mb-2">Availability Summary</h2>
        <div>
          <ScrollArea className="h-[300px]">
            {Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(new Date()), i)).map((day) => (
              <div key={day.toISOString()} className="mb-4">
                <h3 className="font-bold">{format(day, 'EEEE')}</h3>
                <div className="text-sm flex flex-wrap">{renderDaySummary(day)}</div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}