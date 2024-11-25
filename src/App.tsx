import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { parseICSFile } from './utils/icsParser';
import Timetable from './components/Timetable';
import FileUpload from './components/FileUpload';
import { type Course } from './types';

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [finals, setFinals] = useState<Course[]>([]);
  const [showClassCode, setShowClassCode] = useState(false); // Changed default to false

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const { regularCourses, finalExams } = parseICSFile(text);
      setCourses(regularCourses);
      setFinals(finalExams);
    } catch (error) {
      console.error('Error parsing ICS file:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Class Schedule Generator
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <FileUpload onFileUpload={handleFileUpload} />
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Upload size={16} />
              <span>Upload your ICS file to generate your timetable</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-end space-x-4">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={!showClassCode} // Inverted the check
                  onChange={(e) => setShowClassCode(!e.target.checked)} // Inverted the logic
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Show Class Code</span> {/* Changed label text */}
              </label>
            </div>
            <Timetable courses={courses} showClassCode={!showClassCode} />{' '}
            {/* Inverted the prop */}
            {finals.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Final Exams</h2>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {finals.map((final, index) => (
                      <div key={index} className="p-4">
                        <h3 className="font-medium">{final.summary}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(final.start).toLocaleDateString()} at{' '}
                          {new Date(final.start).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' - '}
                          {new Date(final.end).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {final.location}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
