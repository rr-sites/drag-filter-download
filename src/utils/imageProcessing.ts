import { LUTFilter } from "@/types/image-processing";
import { removeBackground } from "@imgly/background-removal";

export const applyLUTFilter = async (
  file: File,
  filter: LUTFilter,
  replaceBG: boolean
): Promise<Blob> => {
  let imageBlob: Blob = file;

  if (replaceBG) {
    imageBlob = await removeBackground(file);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image
        ctx.drawImage(img, 0, 0);

        // Apply custom filter effects
        if (filter !== "normal") {
          applyCanvasFilter(ctx, canvas.width, canvas.height, filter);
        }

        if (replaceBG) {
          // Fill background with yellow behind the filtered image
          ctx.globalCompositeOperation = "destination-over";
          ctx.fillStyle = "rgb(255, 238, 90)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = "source-over";
        }

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          "image/jpeg",
          0.9
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(imageBlob);
  });
};

const applyCanvasFilter = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filter: LUTFilter
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply filter-specific transformations
    switch (filter) {
      case "clarendon":
        r = Math.min(255, r * 1.2);
        g = Math.min(255, g * 1.1);
        b = Math.min(255, b * 0.9);
        break;
      case "gingham":
        r = Math.min(255, r * 1.1);
        g = Math.min(255, g * 1.1);
        b = Math.min(255, b * 1.2);
        break;
      case "moon": {
        const gray = (r + g + b) / 3;
        r = g = b = Math.min(255, gray * 1.1);
        break;
      }
      case "lark":
        r = Math.min(255, r * 1.3);
        g = Math.min(255, g * 1.1);
        b = Math.min(255, b * 0.8);
        break;
      case "reyes":
        r = Math.min(255, r * 1.2);
        g = Math.min(255, g * 1.05);
        b = Math.min(255, b * 0.85);
        break;
      case "juno":
        r = Math.min(255, r * 1.15);
        g = Math.min(255, g * 1.2);
        b = Math.min(255, b * 0.9);
        break;
      case "slumber":
        r = Math.min(255, r * 0.9);
        g = Math.min(255, g * 0.95);
        b = Math.min(255, b * 1.1);
        break;
      case "crema":
        r = Math.min(255, r * 1.1);
        g = Math.min(255, g * 1.05);
        b = Math.min(255, b * 0.95);
        break;
      case "ludwig":
        r = Math.min(255, r * 1.2);
        g = Math.min(255, g * 1.1);
        b = Math.min(255, b * 0.8);
        break;
      case "aden":
        r = Math.min(255, r * 1.1);
        g = Math.min(255, g * 1.15);
        b = Math.min(255, b * 1.2);
        break;
      case "perpetua": {
        const sepia = r * 0.393 + g * 0.769 + b * 0.189;
        r = Math.min(255, sepia);
        g = Math.min(255, sepia * 0.9);
        b = Math.min(255, sepia * 0.8);
        break;
      }
      case "amaro":
        r = Math.min(255, r * 1.25);
        g = Math.min(255, g * 1.1);
        b = Math.min(255, b * 0.85);
        break;
      case "mayfair":
        r = Math.min(255, r * 1.1);
        g = Math.min(255, g * 1.2);
        b = Math.min(255, b * 1.15);
        break;
      case "rise":
        r = Math.min(255, r * 1.3);
        g = Math.min(255, g * 1.2);
        b = Math.min(255, b * 0.9);
        break;
      case "hudson":
        r = Math.min(255, r * 1.2);
        g = Math.min(255, g * 1.1);
        b = Math.min(255, b * 1.3);
        break;
      case "valencia":
        r = Math.min(255, r * 1.4);
        g = Math.min(255, g * 1.1);
        b = Math.min(255, b * 0.8);
        break;
      case "xpro2":
        r = Math.min(255, r * 1.3);
        g = Math.min(255, g * 0.9);
        b = Math.min(255, b * 0.7);
        break;
      case "sierra":
        r = Math.min(255, r * 1.1);
        g = Math.min(255, g * 1.2);
        b = Math.min(255, b * 0.9);
        break;
      case "willow": {
        const willowGray = (r + g + b) / 3;
        r = Math.min(255, willowGray * 1.2);
        g = Math.min(255, willowGray * 1.1);
        b = Math.min(255, willowGray * 0.9);
        break;
      }
      case "lofi":
        r = Math.min(255, r * 1.4);
        g = Math.min(255, g * 1.2);
        b = Math.min(255, b * 0.8);
        break;
      case "inkwell": {
        const inkwellGray = (r + g + b) / 3;
        r = g = b = inkwellGray;
        break;
      }
      case "hefe":
        r = Math.min(255, r * 1.3);
        g = Math.min(255, g * 1.15);
        b = Math.min(255, b * 0.7);
        break;
      case "nashville":
        r = Math.min(255, r * 1.4);
        g = Math.min(255, g * 1.1);
        b = Math.min(255, b * 0.6);
        break;
      case "stinson": {
        r = Math.min(255, r * 1.2);
        g = Math.min(255, g * 1.3);
        b = Math.min(255, b * 1.1);
        break;
      }
      case "vesper":
        r = Math.min(255, r * 1.1);
        g = Math.min(255, g * 1.05);
        b = Math.min(255, b * 1.2);
        break;
      case "earlybird":
        r = Math.min(255, r * 1.4);
        g = Math.min(255, g * 1.2);
        b = Math.min(255, b * 0.7);
        break;
      case "brannan":
        r = Math.min(255, r * 1.3);
        g = Math.min(255, g * 1.1);
        b = Math.min(255, b * 0.8);
        break;
      case "sutro":
        r = Math.min(255, r * 1.2);
        g = Math.min(255, g * 0.9);
        b = Math.min(255, b * 0.7);
        break;
      case "toaster":
        r = Math.min(255, r * 1.5);
        g = Math.min(255, g * 1.2);
        b = Math.min(255, b * 0.6);
        break;
      case "walden":
        r = Math.min(255, r * 1.2);
        g = Math.min(255, g * 1.3);
        b = Math.min(255, b * 1.1);
        break;
      case "nineteen77":
        r = Math.min(255, r * 1.3);
        g = Math.min(255, g * 1.1);
        b = Math.min(255, b * 0.8);
        break;
      case "kelvin":
        r = Math.min(255, r * 1.4);
        g = Math.min(255, g * 1.2);
        b = Math.min(255, b * 0.7);
        break;
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }

  ctx.putImageData(imageData, 0, 0);
};
