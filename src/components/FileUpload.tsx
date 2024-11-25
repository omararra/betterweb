import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

function FileUpload({ onFileUpload }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/calendar': ['.ics'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full max-w-xl p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-2 text-center">
        <Upload className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        <p className="text-lg font-medium">
          {isDragActive ? 'Drop your ICS file here' : 'Drag & drop your ICS file here'}
        </p>
        <p className="text-sm text-gray-500">or click to select file</p>
      </div>
    </div>
  );
}

export default FileUpload;