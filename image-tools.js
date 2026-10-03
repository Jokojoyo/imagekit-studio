export const FORMATS = {
  jpeg: {
    mime: 'image/jpeg',
    label: 'JPG',
    ext: 'jpg'
  },
  png: {
    mime: 'image/png',
    label: 'PNG',
    ext: 'png'
  },
  webp: {
    mime: 'image/webp',
    label: 'WebP',
    ext: 'webp'
  }
};
export const MAX_INPUT_BYTES = 20 * 1024 * 1024;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export function fitImagePlane(width, height, maxWidth, maxHeight) {
  const scale = Math.min(maxWidth / width, maxHeight / height);
  return { width: width * scale, height: height * scale };
}
export function cropRect(width, height, ratio, zoom = 1, panX = 50, panY = 50) {
  if (![width, height, ratio, zoom, panX, panY].every(Number.isFinite) || width <= 0 || height <= 0 || ratio <= 0 || zoom < 1) throw new Error('Invalid crop geometry.');
  let w = Math.min(width, height * ratio) / clamp(zoom, 1, 4),
    h = w / ratio;
  return {
    x: (width - w) * clamp(panX, 0, 100) / 100,
    y: (height - h) * clamp(panY, 0, 100) / 100,
    width: w,
    height: h
  };
}
export function dimensionsError(w, h) {
  if (!Number.isInteger(Number(w)) || !Number.isInteger(Number(h)) || Number(w) < 1 || Number(h) < 1) return 'Enter whole-number dimensions of at least 1 pixel.';
  if (Number(w) > 4096 || Number(h) > 4096) return 'Keep each side at 4,096 pixels or less.';
  if (Number(w) * Number(h) > 16000000) return 'Keep the export under 16 megapixels.';
  return '';
}
export function downloadName(name, format) {
  const base = String(name).replace(/\.[^.]+$/, '').replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-').trim().slice(0, 100) || 'image';
  if (!FORMATS[format]) throw new Error('Choose JPG, PNG or WebP.');
  return base + '.' + FORMATS[format].ext;
}
export function fileType(b) {
  if (b[0] === 255 && b[1] === 216 && b[2] === 255) return 'jpeg';
  if (b[0] === 137 && b[1] === 80 && b[2] === 78 && b[3] === 71 && b[4] === 13 && b[5] === 10 && b[6] === 26 && b[7] === 10) return 'png';
  const s = String.fromCharCode(...b.slice(0, 12));
  return s.startsWith('RIFF') && s.slice(8, 12) === 'WEBP' ? 'webp' : null;
}
export function bytesLabel(b) {
  return b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(2) + ' MB';
}
