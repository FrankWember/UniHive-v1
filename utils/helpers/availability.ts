import { parseISO, addMinutes, format } from 'date-fns';

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
