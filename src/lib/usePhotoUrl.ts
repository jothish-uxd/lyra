import { useEffect, useState } from 'react';
import { loadPhoto } from './storage';

export function usePhotoUrl(photoId: string | undefined): string | undefined {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (!photoId) return;
    let objectUrl: string | undefined;
    let cancelled = false;
    loadPhoto(photoId).then((blob) => {
      if (cancelled || !blob) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setUrl(undefined);
    };
  }, [photoId]);
  return url;
}
