// lib/image-compress.ts
import imageCompression from 'browser-image-compression'

const PRESETS = {
  publikasi: { maxSizeMB: 0.5, maxWidthOrHeight: 1600 },
  toko:      { maxSizeMB: 0.3, maxWidthOrHeight: 1200 },
  pengurus:  { maxSizeMB: 0.2, maxWidthOrHeight: 800 },
  logo:      { maxSizeMB: 0.1, maxWidthOrHeight: 600 },
} as const

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