export function parseTime(timeString: string): Date {
    const [hours, minutes, seconds] = timeString.split('-').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date;
  }
  
  