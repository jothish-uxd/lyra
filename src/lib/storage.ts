import { clear, createStore, del, get, set } from 'idb-keyval';
import type { Board } from '../types';
import { createDefaultBoard } from '../data/defaults';

// Everything stays on this device in IndexedDB. Nothing is sent to a server.
const boardStore = createStore('lyra', 'board');
const photoStore = createStore('lyra-photos', 'photos');
const BOARD_KEY = 'board';

export async function loadBoard(): Promise<Board> {
  const saved = await get<Board>(BOARD_KEY, boardStore);
  if (!saved || saved.version !== 1) return createDefaultBoard();
  // Settings added in later releases fall back to defaults.
  return { ...saved, settings: { ...createDefaultBoard().settings, ...saved.settings } };
}

export function saveBoard(board: Board): Promise<void> {
  return set(BOARD_KEY, board, boardStore);
}

export function savePhoto(id: string, blob: Blob): Promise<void> {
  return set(id, blob, photoStore);
}

export function loadPhoto(id: string): Promise<Blob | undefined> {
  return get<Blob>(id, photoStore);
}

export function deletePhoto(id: string): Promise<void> {
  return del(id, photoStore);
}

export function clearPhotos(): Promise<void> {
  return clear(photoStore);
}

export async function requestPersistentStorage(): Promise<void> {
  // Asks the browser not to evict our data under storage pressure. Best effort.
  try {
    await navigator.storage?.persist?.();
  } catch {
    /* not supported */
  }
}

/** Shrinks a camera photo so a board full of them stays small. */
export async function resizeImage(file: File, maxSide = 480): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not read image'))), 'image/jpeg', 0.85),
  );
}
