import { parseISO, addMinutes, format } from 'date-fns';
import { JsonValue } from '@prisma/client/runtime/library';

type TimeSlot = [string, string];
type DayAvailability = {
  monday?: TimeSlot[] | undefined;
  tuesday?: TimeSlot[] | undefined;
  wednesday?: TimeSlot[] | undefined;
  thursday?: TimeSlot[] | undefined;
  friday?: TimeSlot[] | undefined;
  saturday?: TimeSlot[] | undefined;
  sunday?: TimeSlot[] | undefined;
};

export function splitTimeSlots(availability: DayAvailability): DayAvailability {
  const splitAvailability: DayAvailability = {};

  // Helper function to split a single time slot into 15-minute intervals
  const splitSingleSlot = (slot: TimeSlot): TimeSlot[] => {
    const startTime = parseISO(`1970-01-01T${slot[0]}`);
    const endTime = parseISO(`1970-01-01T${slot[1]}`);
    
    const intervals: TimeSlot[] = [];
    let currentStart = startTime;

    while (currentStart < endTime) {
      const currentEnd = addMinutes(currentStart, 15);
      
      // Stop if the next interval would extend beyond the end time
      if (currentEnd > endTime) break;

      intervals.push([
        format(currentStart, 'HH-mm-ss'),
        format(currentEnd, 'HH-mm-ss')
      ]);

      currentStart = currentEnd;
    }

    return intervals;
  };

  // Process each day's availability
  (Object.keys(availability) as Array<keyof DayAvailability>).forEach(day => {
    const daySlots = availability[day];
    
    if (daySlots) {
      // Flatten and split all slots for the day
      splitAvailability[day] = daySlots.flatMap(splitSingleSlot);
    }
  });

  return splitAvailability;
}

export function combineAvailabilityTimeSlots(availability: DayAvailability): DayAvailability {
  const newAvailability: DayAvailability = {};
  
  (Object.keys(availability) as Array<keyof DayAvailability>).forEach(day => {
    const daySlots = availability[day];
    
    if (daySlots) {
      // Only consolidate if there are slots for the day
      newAvailability[day] = consolidateTimeSlots(daySlots);
    }
  });
  
  return newAvailability;
}



type Booking = {
  date: Date;
  time: JsonValue;
};

function isValidTimeSlots(value: JsonValue): value is { slots: TimeSlot[] } {
  // Type guard to check if the JsonValue is a valid time slots object
  return (
    typeof value === 'object' && 
    value !== null && 
    'slots' in value && 
    Array.isArray((value as any).slots) && 
    (value as any).slots.every((slot: any) => 
      Array.isArray(slot) && 
      slot.length === 2 && 
      typeof slot[0] === 'string' && 
      typeof slot[1] === 'string'
    )
  );
}

export function findAvailableSlots(
  splitAvailability: DayAvailability, 
  date: Date,
  duration: number, 
  bookings: Booking[] = []
): TimeSlot[] {
  // Get the day of the week
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const dayOfWeek = days[date.getDay()];

  // Filter availability for the specific day
  const dayAvailability = splitAvailability[dayOfWeek] || [];

  // Convert duration to number of 15-minute slots needed
  const slotsNeeded = Math.ceil(duration / 15);

  // Type guard to check if the JsonValue is a valid time slots object
  const isValidTimeSlots = (value: JsonValue): value is { slots: TimeSlot[] } => {
    return (
      typeof value === 'object' && 
      value !== null && 
      'slots' in value && 
      Array.isArray((value as any).slots) && 
      (value as any).slots.every((slot: any) => 
        Array.isArray(slot) && 
        slot.length === 2 && 
        typeof slot[0] === 'string' && 
        typeof slot[1] === 'string'
      )
    );
  };

  // Function to check if a sequence of slots is available
  const isSlotSequenceAvailable = (
    availableSlots: TimeSlot[], 
    startIndex: number, 
    bookedTimes: TimeSlot[]
  ): boolean => {
    // Check if we have enough slots from the starting index
    if (startIndex + slotsNeeded > availableSlots.length) {
      return false;
    }

    // Get the sequence of slots we want to check
    const slotSequence = availableSlots.slice(startIndex, startIndex + slotsNeeded);

    // Check if this sequence conflicts with any booked times
    const hasConflict = bookedTimes.some(bookedTime => 
      slotSequence.some(slot => 
        isTimeSlotOverlapping(slot, bookedTime)
      )
    );

    return !hasConflict;
  };

  // Helper to check if two time slots overlap
  const isTimeSlotOverlapping = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
    const start1 = parseISO(`1970-01-01T${slot1[0]}`);
    const end1 = parseISO(`1970-01-01T${slot1[1]}`);
    const start2 = parseISO(`1970-01-01T${slot2[0]}`);
    const end2 = parseISO(`1970-01-01T${slot2[1]}`);

    return !(end1 <= start2 || start1 >= end2);
  };

  // Collect booked times for the specific day
  const bookedTimes: TimeSlot[] = [];
  bookings.forEach(booking => {
    // Check if the booking is for the same date
    if (booking.date.toDateString() === date.toDateString()) {
      // Safely extract booked times
      if (isValidTimeSlots(booking.time)) {
        bookedTimes.push(...booking.time.slots);
      }
    }
  });

  // Find available slots for the day
  const availableSlots: TimeSlot[] = [];

  // Find sequences of slots that match the duration and are not booked
  for (let i = 0; i < dayAvailability.length; i++) {
    if (isSlotSequenceAvailable(dayAvailability, i, bookedTimes)) {
      // Take the first and last slot of the sequence
      const startSlot = dayAvailability[i];
      const endSlot = dayAvailability[i + slotsNeeded - 1];
      availableSlots.push([startSlot[0], endSlot[1]]);
    }
  }

  return availableSlots;
}


export function parseBookingTime(time: JsonValue): { startTime: string; endTime: string } | null {
  // Type guard to validate the time structure
  const isValidTimeSlots = (value: JsonValue): value is TimeSlot[] => {
    return (
      typeof value === 'object' && 
      value !== null && 
      Array.isArray((value as any)) && 
      (value as any).length > 0 && 
      (value as any).every((slot: any) => 
        Array.isArray(slot) && 
        slot.length === 2 && 
        typeof slot[0] === 'string' && 
        typeof slot[1] === 'string'
      )
    );
  };

  // Check if the time is valid
  if (!isValidTimeSlots(time)) {
    return null;
  }

  // Return the first slot's start time and the last slot's end time
  return {
    startTime: time[0][0],
    endTime: time[time.length - 1][1]
  };
}

export function parseAvailability(availability: JsonValue): DayAvailability | null {
  // Type guard to validate the availability structure
  const isValidAvailability = (value: JsonValue): value is DayAvailability => {
    return (
      typeof value === 'object' &&
      value !== null &&
      Object.keys(value).every(day => 
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(day) &&
        (Array.isArray((value as Record<string, any>)[day]) || (value as Record<string, any>)[day] === undefined)
      )
    );
  };

  // Check if the availability is valid
  if (!isValidAvailability(availability)) {
    return null;
  }

  // Return the parsed availability following the DayAvailability interface
  return availability as DayAvailability;
}

export function getClosestSlot(availability: DayAvailability): TimeSlot | null {
  const today = new Date();
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = daysOfWeek[today.getDay()];
  
  switch (currentDay) {
    case 'sunday':
      return availability.sunday?.[0] || null;
    case 'monday':
      return availability.monday?.[0] || null;
    case 'tuesday':
      return availability.tuesday?.[0] || null;
    case 'wednesday':
      return availability.wednesday?.[0] || null;
    case 'thursday':
      return availability.thursday?.[0] || null;
    case 'friday':
      return availability.friday?.[0] || null;
    case 'saturday':
      return availability.saturday?.[0] || null;
    default:
      return null;
  }
}

export function getClosestDayOfTheWeekAvailable(availability: DayAvailability): string | null {
  const today = new Date();
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayIndex = today.getDay();

  // Find available days
  const availableDays = daysOfWeek.filter(day => {
    switch (day) {
      case 'sunday':
        return availability.sunday?.length! > 0;
      case 'monday':
        return availability.monday?.length! > 0;
      case 'tuesday':
        return availability.tuesday?.length! > 0;
      case 'wednesday':
        return availability.wednesday?.length! > 0;
      case 'thursday':
        return availability.thursday?.length! > 0;
      case 'friday':
        return availability.friday?.length! > 0;
      case 'saturday':
        return availability.saturday?.length! > 0;
      default:
        return false;
    }
  });

  // If no days are available, return null
  if (availableDays.length === 0) {
    return null;
  }

  // Find the closest available day
  let closestDay = availableDays[0];
  let closestDistance = (availableDays[0] === daysOfWeek[todayIndex]) ? 0 : 7;

  for (const day of availableDays) {
    const dayIndex = daysOfWeek.indexOf(day);
    const distance = (dayIndex - todayIndex + 7) % 7; // Calculate distance in a circular manner

    if (distance < closestDistance) {
      closestDistance = distance;
      closestDay = day;
    }
  }

  return closestDay;
}

export function consolidateTimeSlots(slots: TimeSlot[]): TimeSlot[] {
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