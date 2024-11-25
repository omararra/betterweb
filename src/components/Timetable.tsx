import { useState } from 'react';
import { type Course } from '../types';
import CourseDetails from './CourseDetails';

interface TimetableProps {
  courses: Course[];
  showClassCode: boolean;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const DAY_MAP: Record<string, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
};

function Timetable({ courses, showClassCode }: TimetableProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const times = courses.flatMap((course) => [
    new Date(course.start).getHours() * 60 +
      new Date(course.start).getMinutes(),
    new Date(course.end).getHours() * 60 + new Date(course.end).getMinutes(),
  ]);

  const startTime = Math.floor(Math.min(...times) / 30) * 30;
  const endTime = Math.ceil(Math.max(...times) / 30) * 30;

  const timeSlots: number[] = [];
  for (let time = startTime; time <= endTime; time += 30) {
    timeSlots.push(time);
  }

  const getTimeString = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const formatSummary = (summary: string) => {
    if (showClassCode) return summary;
    const match = summary.match(/(.*?)\s+[A-Z]+\s+\d+\s+/);
    return match ? match[1].trim() : summary;
  };

  const getCourseStyle = (course: Course, dayIndex: number) => {
    if (!course.days.includes(Object.keys(DAY_MAP)[dayIndex])) return null;

    const courseStart = new Date(course.start);
    const courseEnd = new Date(course.end);
    const startMinutes = courseStart.getHours() * 60 + courseStart.getMinutes();
    const endMinutes = courseEnd.getHours() * 60 + courseEnd.getMinutes();

    const slotHeight = 48; // Height of each 30-minute slot in pixels
    const totalHeight = ((endTime - startTime) / 30) * slotHeight; // Total height based on the actual minutes span
    const minutesInDay = endTime - startTime;

    const top = ((startMinutes - startTime) / minutesInDay) * totalHeight;
    const height = ((endMinutes - startMinutes) / minutesInDay) * totalHeight;

    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="grid grid-cols-[auto,1fr,1fr,1fr,1fr,1fr] divide-x divide-gray-200">
          {/* Time column */}
          <div className="w-24">
            <div className="h-12 border-b border-gray-200"></div>
            <div
              className="relative"
              style={{ height: `${timeSlots.length * 48}px` }}
            >
              {timeSlots.map((time, index) => (
                <div
                  key={time}
                  className="absolute w-full border-b border-gray-100 text-xs text-gray-500 px-2"
                  style={{ top: `${index * 48 + 16}px`, height: '32px' }}
                >
                  <span>{getTimeString(time)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Days columns */}
          {DAYS.map((day, dayIndex) => (
            <div key={day} className="relative">
              <div className="h-12 flex items-center justify-center border-b border-gray-200 font-medium">
                {day}
              </div>
              <div
                className="relative"
                style={{ height: `${timeSlots.length * 4}px` }}
              >
                {timeSlots.map((_, index) => (
                  <div
                    key={index}
                    className="absolute w-full border-b border-gray-100"
                    style={{ top: `${index * 48}px`, height: '48px' }}
                  ></div>
                ))}
                {courses.map((course, courseIndex) => {
                  const style = getCourseStyle(course, dayIndex);
                  if (!style) return null;

                  return (
                    <div
                      key={`${courseIndex}-${dayIndex}`}
                      className="absolute w-full px-1"
                      style={style}
                      onClick={() => setSelectedCourse(course)}
                    >
                      <div className="h-full w-full rounded bg-blue-100 p-1 overflow-hidden text-[11px] leading-tight hover:bg-blue-200 cursor-pointer transition-colors">
                        <div className="font-medium text-blue-900">
                          {formatSummary(course.summary)}
                        </div>
                        <div className="text-blue-700 text-[10px]">
                          {course.location}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <CourseDetails
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </>
  );
}

export default Timetable;
