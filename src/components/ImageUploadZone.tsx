
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

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
        border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isDragActive 
          ? 'border-gray-400 bg-gray-50' 
          : 'border-gray-300 hover:border-gray-400'
        }
      `}
    >
      <input {...getInputProps()} />
      
      <Upload className="h-8 w-8 mx-auto mb-4 text-gray-400" />
      <p className="text-gray-600 mb-4">
        {isDragActive ? 'Drop images here' : 'Drag images here or click to select'}
      </p>
      
      <Button onClick={open} variant="outline" size="sm">
        Select Images
      </Button>
    </div>
  );
};

export default ImageUploadZone;
