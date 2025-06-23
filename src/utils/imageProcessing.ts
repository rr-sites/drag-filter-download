
import { LUTFilter, LUTValues } from '@/types/image-processing';

// LUT filter presets
const LUT_PRESETS: Record<LUTFilter, LUTValues> = {
  cinematic: {
    brightness: 0.05,
    contrast: 0.2,
    saturation: 0.1,
    temperature: 0.1,
    tint: 0.05,
    highlights: -0.1,
    shadows: 0.15,
    gamma: 0.95,
  },
  vintage: {
    brightness: 0.1,
    contrast: -0.05,
    saturation: -0.2,
    temperature: 0.2,
    tint: 0.1,
    highlights: -0.15,
    shadows: 0.1,
    gamma: 1.1,
  },
  cool: {
    brightness: 0.02,
    contrast: 0.1,
    saturation: 0.05,
    temperature: -0.15,
    tint: -0.05,
    highlights: 0.05,
    shadows: -0.05,
    gamma: 1.0,
  },
  warm: {
    brightness: 0.08,
    contrast: 0.05,
    saturation: 0.15,
    temperature: 0.25,
    tint: 0.08,
    highlights: -0.05,
    shadows: 0.1,
    gamma: 1.05,
  },
  highContrast: {
    brightness: 0.0,
    contrast: 0.4,
    saturation: 0.2,
    temperature: 0.0,
    tint: 0.0,
    highlights: -0.2,
    shadows: 0.2,
    gamma: 0.9,
  },
};

export const applyLUTFilter = async (file: File, filter: LUTFilter): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply LUT filter
        const lut = LUT_PRESETS[filter];
        applyLUTToImageData(data, lut);
        
        // Put processed data back
        ctx.putImageData(imageData, 0, 0);
        
        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/jpeg', 0.9);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

const applyLUTToImageData = (data: Uint8ClampedArray, lut: LUTValues) => {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i] / 255;
    let g = data[i + 1] / 255;
    let b = data[i + 2] / 255;
    
    // Apply gamma correction
    r = Math.pow(r, lut.gamma);
    g = Math.pow(g, lut.gamma);
    b = Math.pow(b, lut.gamma);
    
    // Apply brightness
    r += lut.brightness;
    g += lut.brightness;
    b += lut.brightness;
    
    // Apply contrast
    r = ((r - 0.5) * (1 + lut.contrast)) + 0.5;
    g = ((g - 0.5) * (1 + lut.contrast)) + 0.5;
    b = ((b - 0.5) * (1 + lut.contrast)) + 0.5;
    
    // Convert to HSL for saturation and temperature adjustments
    const hsl = rgbToHsl(r, g, b);
    
    // Apply saturation
    hsl[1] = Math.max(0, Math.min(1, hsl[1] * (1 + lut.saturation)));
    
    // Apply temperature (shift hue towards warm/cool)
    if (lut.temperature !== 0) {
      hsl[0] = (hsl[0] + lut.temperature * 0.1) % 1;
      if (hsl[0] < 0) hsl[0] += 1;
    }
    
    // Convert back to RGB
    [r, g, b] = hslToRgb(hsl[0], hsl[1], hsl[2]);
    
    // Apply highlights and shadows
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    if (luminance > 0.7) {
      // Highlights
      const factor = 1 + lut.highlights;
      r *= factor;
      g *= factor;
      b *= factor;
    } else if (luminance < 0.3) {
      // Shadows
      const factor = 1 + lut.shadows;
      r *= factor;
      g *= factor;
      b *= factor;
    }
    
    // Apply tint (magenta/green shift)
    if (lut.tint !== 0) {
      r += lut.tint * 0.1;
      g -= lut.tint * 0.05;
    }
    
    // Clamp values and convert back to 0-255 range
    data[i] = Math.max(0, Math.min(255, Math.round(r * 255)));
    data[i + 1] = Math.max(0, Math.min(255, Math.round(g * 255)));
    data[i + 2] = Math.max(0, Math.min(255, Math.round(b * 255)));
  }
};

// Helper functions for color space conversion
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [r, g, b];
};
