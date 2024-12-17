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
  const isValidTimeSlots = (value: JsonValue): value is { slots: TimeSlot[] } => {
    return (
      typeof value === 'object' && 
      value !== null && 
      'slots' in value && 
      Array.isArray((value as any).slots) && 
      (value as any).slots.length > 0 && 
      (value as any).slots.every((slot: any) => 
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

  // Sort slots to ensure we get the absolute first and last times
  const sortedSlots = [...time.slots].sort((a, b) => {
    // Compare first elements (start times) of each slot
    return a[0].localeCompare(b[0]);
  });

  // Return the first slot's start time and the last slot's end time
  return {
    startTime: sortedSlots[0][0],
    endTime: sortedSlots[sortedSlots.length - 1][1]
  };
}