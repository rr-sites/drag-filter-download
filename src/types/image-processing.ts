
export type LUTFilter = 
  | 'normal'
  | 'clarendon' 
  | 'gingham'
  | 'moon'
  | 'lark'
  | 'reyes'
  | 'juno'
  | 'slumber'
  | 'crema'
  | 'ludwig'
  | 'aden'
  | 'perpetua'
  | 'amaro'
  | 'mayfair'
  | 'rise'
  | 'hudson'
  | 'valencia'
  | 'xpro2'
  | 'sierra'
  | 'willow'
  | 'lofi'
  | 'earlybird'
  | 'brannan'
  | 'inkwell'
  | 'hefe'
  | 'nashville'
  | 'sutro'
  | 'toaster'
  | 'walden'
  | 'nineteen77'
  | 'kelvin'
  | 'stinson'
  | 'vesper';

export interface ProcessedImage {
  id: string;
  originalName: string;
  processedBlob: Blob;
  filter: LUTFilter;
}
