
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ProcessedImage } from '@/types/image-processing';

interface ProcessedImageGridProps {
  images: ProcessedImage[];
}

const ProcessedImageGrid = ({ images }: ProcessedImageGridProps) => {
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

  const getImageUrl = (image: ProcessedImage) => {
    if (!imageUrls.has(image.id)) {
      const url = URL.createObjectURL(image.processedBlob);
      setImageUrls(prev => new Map(prev).set(image.id, url));
      return url;
    }
    return imageUrls.get(image.id)!;
  };

  const downloadSingleImage = (image: ProcessedImage) => {
    const url = URL.createObjectURL(image.processedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${image.filter}_${image.originalName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {images.map((image) => (
        <div key={image.id} className="group relative">
          <div className="aspect-square bg-gray-100 rounded overflow-hidden">
            <img
              src={getImageUrl(image)}
              alt={image.originalName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
              <Button
                size="sm"
                onClick={() => downloadSingleImage(image)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-1 truncate capitalize">
            {image.filter}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProcessedImageGrid;
