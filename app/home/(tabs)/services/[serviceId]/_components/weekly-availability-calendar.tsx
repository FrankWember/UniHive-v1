'use client'

import React, { useMemo } from 'react'
import { addDays, format, isSameDay, startOfWeek, parseISO } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Availability, CalendarEvent, generateEvents, formatTimeRange, parseAvailability } from "@/utils/helpers/calendar-helpers"
import { consolidateTimeSlots } from '@/utils/helpers/availability'
import { Prisma } from '@prisma/client'
import { Table, TableCell, TableRow, TableBody } from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'

interface WeeklyAvailabilityCalendarProps {
  availability: Prisma.JsonValue;
}

type TimeSlot = [string, string];



function formatTime(timeString: string): string {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const date = new Date(1970, 0, 1, hours, minutes, seconds || 0);
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
    if (dayEvents.length === 0) return <Badge variant='outline'>Not Available</Badge>

    // Convert events to time slots and consolidate them
    const timeSlots = dayEvents.map(event => [
      format(event.start, 'HH:mm:ss'),
      format(event.end, 'HH:mm:ss')
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
      <div className="w-full min-w-64">
          <h2 className="text-2xl font-semibold mb-4">Availability Summary</h2>
        <div>
          <Table className='w-full'>
            <TableBody>
              {Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(new Date()), i)).map((day) => (
                <TableRow>
                  <TableCell className="font-semibold">{format(day, 'EEEE')}</TableCell>
                  <TableCell><div className="text-sm flex flex-wrap">{renderDaySummary(day)}</div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
