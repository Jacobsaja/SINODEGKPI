// lib/image-compress.ts
import imageCompression from 'browser-image-compression'

const PRESETS = {
  publikasi: { maxSizeMB: 0.5, maxWidthOrHeight: 1600 },
  toko:      { maxSizeMB: 0.3, maxWidthOrHeight: 1200 },
  pengurus:  { maxSizeMB: 0.2, maxWidthOrHeight: 800 },
  logo:      { maxSizeMB: 0.1, maxWidthOrHeight: 600 },
  jemaat:    { maxSizeMB: 0.3, maxWidthOrHeight: 1200 },
} as const

// Maximum uncompressed payload threshold per preset (MB)
export const MAX_INPUT_SIZE_MB: Partial<Record<keyof typeof PRESETS, number>> = {
  jemaat: 1,
}

/**
 * Validates raw payload file size against preset limits.
 */
export function validateInputSize(
  file: File,
  preset: keyof typeof PRESETS
): string | null {
  const maxMB = MAX_INPUT_SIZE_MB[preset];
  if (!maxMB) return null;

  const sizeMB = file.size / 1024 / 1024;
  if (sizeMB > maxMB) {
    return `Ukuran file maksimal ${maxMB}MB. File Anda ${sizeMB.toFixed(1)}MB.`;
  }
  return null;
}

export async function compressBeforeUpload(
  file: File,
  preset: keyof typeof PRESETS
) {
  const options = {
    ...PRESETS[preset],
    useWebWorker: true,
    fileType: 'image/webp' as const, // WebP conversion for optimal compression ratio
  }

  try {
    return await imageCompression(file, options)
  } catch (err) {
    console.error('Compress gagal, upload asli:', err)
    return file // Fallback to raw file stream on error
  }
}