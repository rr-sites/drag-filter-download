
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadZoneProps {
  onImagesUploaded: (files: File[]) => void;
}

const ImageUploadZone = ({ onImagesUploaded }: ImageUploadZoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    onImagesUploaded(imageFiles);
    setIsDragActive(false);
  }, [onImagesUploaded]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    noClick: true,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200
        ${isDragActive 
          ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
          : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
        }
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-4">
        <div className={`
          p-4 rounded-full transition-colors duration-200
          ${isDragActive ? 'bg-indigo-100' : 'bg-slate-100'}
        `}>
          <Upload className={`
            h-8 w-8 transition-colors duration-200
            ${isDragActive ? 'text-indigo-600' : 'text-slate-500'}
          `} />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            {isDragActive ? 'Drop images here' : 'Upload your images'}
          </h3>
          <p className="text-slate-500 mb-4">
            Drag and drop your images here, or click to select files
          </p>
          
          <Button 
            onClick={open}
            variant="outline"
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Select Images
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadZone;
