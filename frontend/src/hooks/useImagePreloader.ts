import { useEffect, useState } from 'react';

export default function useImagePreloader(imageUrls: string[]) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setReady(true);
      return;
    }

    let active = true;
    const images = imageUrls.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const handleReady = () => {
      if (!active) return;
      setReady(true);
    };

    let finishedCount = 0;
    const onLoad = () => {
      finishedCount += 1;
      if (finishedCount === images.length) {
        handleReady();
      }
    };

    images.forEach((img) => {
      img.onload = onLoad;
      img.onerror = onLoad;
    });

    const fallback = window.setTimeout(handleReady, 5000);

    return () => {
      active = false;
      window.clearTimeout(fallback);
    };
  }, [imageUrls]);

  return ready;
}
