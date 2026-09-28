export const generateGoogleCalendarUrl = (
  title: string,
  details: string,
  location: string,
  startDateStr: string, // YYYYMMDDTHHmmssZ
  endDateStr: string
) => {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const url = `${base}&text=${encodeURIComponent(title)}&details=${encodeURIComponent(
    details
  )}&location=${encodeURIComponent(location)}&dates=${startDateStr}/${endDateStr}`;
  return url;
};

export const downloadIcsFile = (
  title: string,
  description: string,
  location: string,
  startDate: string, // e.g. 'December 5, 2026'
  startTime: string = '10:00 AM'
) => {
  // Format for ICS with date and time consideration
  const isReception = title.toLowerCase().includes('reception') || startDate.includes('6');
  const dtStart = isReception ? '20261206T041500Z' : '20261205T031500Z';
  const dtEnd = isReception ? '20261206T091500Z' : '20261205T101500Z';

  const fullDescription = `${description} | Schedule: ${startDate} at ${startTime}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nepali Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${fullDescription.replace(/\n/g, ' ')}`,
    `LOCATION:${location}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${title.replace(/\s+/g, '-').toLowerCase()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
