
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Image as ImageIcon, Palette, Sparkles } from 'lucide-react';
import ImageUploadZone from '@/components/ImageUploadZone';
import FilterSelector from '@/components/FilterSelector';
import ProcessedImageGrid from '@/components/ProcessedImageGrid';
import { ProcessedImage, LUTFilter } from '@/types/image-processing';
import { applyLUTFilter } from '@/utils/imageProcessing';

const Index = () => {
  const [originalImages, setOriginalImages] = useState<File[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<LUTFilter>('cinematic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  const handleImagesUploaded = useCallback((files: File[]) => {
    setOriginalImages(files);
    setProcessedImages([]);
    toast({
      title: "Images uploaded",
      description: `${files.length} image(s) ready for processing`,
    });
  }, [toast]);

  const processImages = useCallback(async () => {
    if (originalImages.length === 0) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    const processed: ProcessedImage[] = [];

    for (let i = 0; i < originalImages.length; i++) {
      const file = originalImages[i];
      try {
        const processedBlob = await applyLUTFilter(file, selectedFilter);
        processed.push({
          id: `${file.name}-${Date.now()}-${i}`,
          originalName: file.name,
          processedBlob,
          filter: selectedFilter,
        });
        setProcessingProgress(((i + 1) / originalImages.length) * 100);
      } catch (error) {
        console.error('Error processing image:', file.name, error);
        toast({
          title: "Processing error",
          description: `Failed to process ${file.name}`,
          variant: "destructive",
        });
      }
    }

    setProcessedImages(processed);
    setIsProcessing(false);
    
    if (processed.length > 0) {
      toast({
        title: "Processing complete",
        description: `${processed.length} image(s) processed with ${selectedFilter} filter`,
      });
    }
  }, [originalImages, selectedFilter, toast]);

  const downloadAllImages = useCallback(() => {
    if (processedImages.length === 0) return;

    processedImages.forEach((image, index) => {
      const url = URL.createObjectURL(image.processedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedFilter}_${image.originalName}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });

    toast({
      title: "Download started",
      description: `Downloading ${processedImages.length} processed image(s)`,
    });
  }, [processedImages, selectedFilter, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Palette className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              LUT Color Processor
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transform your images with professional color correction filters. 
            Upload, process, and download your enhanced photos in seconds.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 p-6 border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-colors">
          <ImageUploadZone onImagesUploaded={handleImagesUploaded} />
          
          {originalImages.length > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                {originalImages.length} image(s) selected
              </Badge>
            </div>
          )}
        </Card>

        {/* Filter Selection */}
        {originalImages.length > 0 && (
          <Card className="mb-8 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-semibold">Choose Color Filter</h2>
            </div>
            <FilterSelector 
              selectedFilter={selectedFilter} 
              onFilterChange={setSelectedFilter} 
            />
            
            <div className="mt-6 flex gap-4">
              <Button 
                onClick={processImages} 
                disabled={isProcessing}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isProcessing ? 'Processing...' : 'Apply Filter'}
              </Button>
              
              {isProcessing && (
                <div className="flex-1 max-w-xs">
                  <Progress value={processingProgress} className="h-2" />
                  <p className="text-sm text-slate-500 mt-1">
                    {Math.round(processingProgress)}% complete
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Processed Images */}
        {processedImages.length > 0 && (
          <Card className="mb-8 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold">Processed Images</h2>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {processedImages.length} ready
                </Badge>
              </div>
              
              <Button 
                onClick={downloadAllImages}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
            
            <ProcessedImageGrid images={processedImages} />
          </Card>
        )}

        {/* Instructions */}
        {originalImages.length === 0 && (
          <Card className="p-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Get Started
            </h3>
            <p className="text-blue-700 mb-4">
              Drag and drop your images above or click to select files
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-blue-600">
              <Badge variant="outline">JPG</Badge>
              <Badge variant="outline">PNG</Badge>
              <Badge variant="outline">WebP</Badge>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
