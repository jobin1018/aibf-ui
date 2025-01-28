export function formatTime(time24: string): string {
  // Check if the time is in the correct format HH:MM:SS
  const timeRegex = /^(\d{2}):(\d{2}):(\d{2})$/;
  const match = time24.match(timeRegex);

  if (!match) {
    return time24; // Return original if format is incorrect
  }

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}
