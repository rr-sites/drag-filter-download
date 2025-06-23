
export type LUTFilter = 'cinematic' | 'vintage' | 'cool' | 'warm' | 'highContrast';

export interface ProcessedImage {
  id: string;
  originalName: string;
  processedBlob: Blob;
  filter: LUTFilter;
}

export interface LUTValues {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
  highlights: number;
  shadows: number;
  gamma: number;
}
