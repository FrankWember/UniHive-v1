import { addDays, setHours, setMinutes, setSeconds } from "date-fns"
import { Prisma } from '@prisma/client'

export interface Availability {
  [day: string]: [string, string][];
}

export interface CalendarEvent {
  id: string;
  name: string;
  start: Date;
  end: Date;
}

const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function generateEvents(availability: Availability): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

  Object.entries(availability).forEach(([day, slots]) => {
    const dayIndex = daysOfWeek.indexOf(day.toLowerCase());
    const date = addDays(startOfWeek, dayIndex);

    slots.forEach(([start, end], index) => {
      const [startHour, startMinute] = start.split('-').map(Number);
      const [endHour, endMinute] = end.split('-').map(Number);

      const eventStart = setHours(setMinutes(setSeconds(date, 0), startMinute), startHour);
      const eventEnd = setHours(setMinutes(setSeconds(date, 0), endMinute), endHour);

      events.push({
        id: `${day}-${index}`,
        name: 'Available',
        start: eventStart,
        end: eventEnd,
      });
    });
  });

  return events;
}

export function formatTimeRange(start: Date, end: Date): string {
  return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export function parseAvailability(jsonValue: Prisma.JsonValue): Availability {
  if (typeof jsonValue !== 'object' || jsonValue === null) {
    throw new Error('Invalid availability data');
  }

  const availability: Availability = {};

  for (const [day, slots] of Object.entries(jsonValue)) {
    if (!Array.isArray(slots)) {
      continue;
    }

    availability[day] = slots.filter((slot): slot is [string, string] => 
      Array.isArray(slot) && 
      slot.length === 2 && 
      typeof slot[0] === 'string' && 
      typeof slot[1] === 'string'
    );
  }

  return availability;
}

