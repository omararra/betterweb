import { X } from 'lucide-react';
import { type Course } from '../types';

interface CourseDetailsProps {
  course: Course;
  onClose: () => void;
}

export default function CourseDetails({ course, onClose }: CourseDetailsProps) {
  const formatDescription = (description: string) => {
    return description.split('\\n').map((line, index) => (
      <p key={index} className="py-1">
        {line.replace(/\\/g, '')}
      </p>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{course.summary}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <div className="text-sm text-gray-600">
            {course.description && formatDescription(course.description)}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-semibold">Location:</p>
            <p>{course.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
