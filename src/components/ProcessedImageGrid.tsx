
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <div className="aspect-square relative overflow-hidden bg-slate-100">
            <img
              src={getImageUrl(image)}
              alt={image.originalName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <Button
                size="sm"
                onClick={() => downloadSingleImage(image)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-800 truncate text-sm">
                {image.originalName}
              </h3>
              <Badge variant="secondary" className="text-xs capitalize">
                {image.filter}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessedImageGrid;
