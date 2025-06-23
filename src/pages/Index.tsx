import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Download, Image as ImageIcon } from "lucide-react";
import ImageUploadZone from "@/components/ImageUploadZone";
import FilterSelector from "@/components/FilterSelector";
import ProcessedImageGrid from "@/components/ProcessedImageGrid";
import { ProcessedImage, LUTFilter } from "@/types/image-processing";
import { applyLUTFilter } from "@/utils/imageProcessing";

const Index = () => {
  const [originalImages, setOriginalImages] = useState<File[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<LUTFilter>("normal");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  const handleImagesUploaded = useCallback(
    (files: File[]) => {
      setOriginalImages(files);
      setProcessedImages([]);
      toast({
        title: "Images uploaded",
        description: `${files.length} image(s) ready for processing`,
      });
    },
    [toast]
  );

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
        console.error("Error processing image:", file.name, error);
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
        description: `${processed.length} image(s) processed`,
      });
    }
  }, [originalImages, selectedFilter, toast]);

  useEffect(() => {
    // When images are first uploaded, process them with the default filter.
    if (originalImages.length > 0) {
      processImages();
    }
    // This effect should only run when images are uploaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalImages]);

  useEffect(() => {
    // Don't run on initial mount or when there are no images.
    if (isInitialMount.current || originalImages.length === 0) {
      isInitialMount.current = false;
      return;
    }
    processImages();
    // This effect should only run when the filter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter]);

  const downloadAllImages = useCallback(() => {
    if (processedImages.length === 0) return;

    processedImages.forEach((image) => {
      const url = URL.createObjectURL(image.processedBlob);
      const link = document.createElement("a");
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-normal mb-2">
            Datameister Image Filter
          </h1>
          <p>Drag, filter, and download your images in a flash.</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <ImageUploadZone onImagesUploaded={handleImagesUploaded} />

            {originalImages.length > 0 && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                <ImageIcon className="h-4 w-4" />
                {originalImages.length} image(s) selected
              </div>
            )}
          </div>

          {originalImages.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Choose Filter</h2>
              <FilterSelector
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
              />

              <div className="mt-6 flex items-center gap-4">
                {isProcessing && (
                  <div className="flex-1 max-w-xs">
                    <Progress value={processingProgress} className="h-2" />
                    <p className="text-sm mt-1">
                      {Math.round(processingProgress)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {processedImages.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Processed Images</h2>

                <Button onClick={downloadAllImages}>
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>

              <ProcessedImageGrid images={processedImages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
