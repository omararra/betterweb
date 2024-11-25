import { type Course } from '../types';

export function parseICSFile(icsContent: string): {
  regularCourses: Course[];
  finalExams: Course[];
} {
  const events = icsContent
    .split('BEGIN:VEVENT')
    .slice(1)
    .map((event) => event.split('END:VEVENT')[0]);

  const regularCourses: Course[] = [];
  const finalExams: Course[] = [];

  events.forEach((event) => {
    const summary = event.match(/SUMMARY:(.+)/)?.[1] || '';
    const locationMatch = event.match(/Building:\s?(.+?)\s?Room:\s?(.+)/);
    const location = locationMatch
      ? `Building: ${locationMatch[1]} \nRoom: ${locationMatch[2]}`
      : '';
    const description =
      event.match(
        /DESCRIPTION:(.+?)(?=\r?\n[A-Z]|\r?\n$|\r?\n\r?\n|$)/s
      )?.[1] || '';
    const startMatch = event.match(/DTSTART;TZID=Asia\/Qatar:(\d{8})T(\d{6})/);
    const endMatch = event.match(/DTEND;TZID=Asia\/Qatar:(\d{8})T(\d{6})/);
    const rruleMatch = event.match(/RRULE:(.+)/)?.[1];

    if (!startMatch || !endMatch) return;

    const startDate = `${startMatch[1].slice(0, 4)}-${startMatch[1].slice(
      4,
      6
    )}-${startMatch[1].slice(6, 8)}`;
    const startTime = `${startMatch[2].slice(0, 2)}:${startMatch[2].slice(
      2,
      4
    )}:${startMatch[2].slice(4, 6)}`;
    const endDate = `${endMatch[1].slice(0, 4)}-${endMatch[1].slice(
      4,
      6
    )}-${endMatch[1].slice(6, 8)}`;
    const endTime = `${endMatch[2].slice(0, 2)}:${endMatch[2].slice(
      2,
      4
    )}:${endMatch[2].slice(4, 6)}`;

    const start = `${startDate}T${startTime}`;
    const end = `${endDate}T${endTime}`;

    if (rruleMatch) {
      const untilMatch = rruleMatch.match(/UNTIL=(\d{8})/)?.[1];
      const bydayMatch = rruleMatch.match(/BYDAY=([^;]+)/)?.[1].split(',');

      const course = {
        summary,
        location,
        description,
        start,
        end,
        days: bydayMatch || [],
      };

      if (untilMatch === startMatch[1]) {
        finalExams.push(course);
      } else {
        regularCourses.push(course);
      }
    }
  });

  return { regularCourses, finalExams };
}
