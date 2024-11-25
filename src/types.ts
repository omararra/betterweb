export interface Course {
  summary: string;
  start: string;
  end: string;
  location: string;
  days: string[];
  description?: string;
}

export interface ParsedICS {
  regularCourses: Course[];
  finalExams: Course[];
}