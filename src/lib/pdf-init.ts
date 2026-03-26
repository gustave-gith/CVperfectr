import { DOMMatrix, DOMPoint, DOMRect, ImageData, Image, Path2D } from '@napi-rs/canvas';

/**
 * Polyfill for browser-only primitives required by pdfjs-dist / pdf-parse v2
 * in a Node.js environment.
 */
if (typeof globalThis.DOMMatrix === 'undefined') {
  // @ts-ignore
  globalThis.DOMMatrix = DOMMatrix;
}

if (typeof globalThis.DOMPoint === 'undefined') {
  // @ts-ignore
  globalThis.DOMPoint = DOMPoint;
}

if (typeof globalThis.DOMRect === 'undefined') {
  // @ts-ignore
  globalThis.DOMRect = DOMRect;
}

if (typeof globalThis.ImageData === 'undefined') {
  // @ts-ignore
  globalThis.ImageData = ImageData;
}

if (typeof globalThis.Image === 'undefined') {
  // @ts-ignore
  globalThis.Image = Image;
}

if (typeof globalThis.Path2D === 'undefined') {
  // @ts-ignore
  globalThis.Path2D = Path2D;
}
