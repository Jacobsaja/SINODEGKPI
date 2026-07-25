// lib/image-compress.ts
import imageCompression from 'browser-image-compression'

const PRESETS = {
  publikasi: { maxSizeMB: 0.5, maxWidthOrHeight: 1600 },
  toko:      { maxSizeMB: 0.3, maxWidthOrHeight: 1200 },
  pengurus:  { maxSizeMB: 0.2, maxWidthOrHeight: 800 },
  logo:      { maxSizeMB: 0.1, maxWidthOrHeight: 600 },
  jemaat:    { maxSizeMB: 0.3, maxWidthOrHeight: 1200 },
} as const

// Batas ukuran file INPUT (sebelum kompresi), per preset.
// Jemaat: user hanya boleh upload file mentah maksimal 1MB.
export const MAX_INPUT_SIZE_MB: Partial<Record<keyof typeof PRESETS, number>> = {
  jemaat: 1,
}

/**
 * Validasi ukuran file sebelum kompresi.
 * Return null kalau lolos, atau pesan error kalau file terlalu besar.
 */
export function validateInputSize(
  file: File,
  preset: keyof typeof PRESETS
): string | null {
  const maxMB = MAX_INPUT_SIZE_MB[preset];
  if (!maxMB) return null; // preset tanpa batas input tetap jalan seperti biasa

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
    fileType: 'image/webp' as const, // konsisten, lebih kecil dari jpeg
  }

  try {
    return await imageCompression(file, options)
  } catch (err) {
    console.error('Compress gagal, upload asli:', err)
    return file // fallback, jangan blokir upload kalau compress error
  }
}