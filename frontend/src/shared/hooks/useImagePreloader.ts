import { useEffect, useState, useRef } from 'react';

/**
 * Preloads an array of image URLs and returns true when all are loaded (or on error/timeout).
 * Handles dynamic URL changes gracefully — re-runs when the url list identity changes.
 * Includes a 4s hard timeout so the preloader never blocks the app forever.
 */
export default function useImagePreloader(imageUrls: string[]) {
  const [ready, setReady] = useState(false);
  // Serialize URLs to detect actual content changes, not reference changes
  const urlKey = imageUrls.join('|');

  useEffect(() => {
    // Reset on new URL set
    setReady(false);

    if (imageUrls.length === 0) {
      setReady(true);
      return;
    }

    let active = true;
    let finishedCount = 0;

    const handleReady = () => {
      if (!active) return;
      setReady(true);
    };

    const onFinish = () => {
      finishedCount += 1;
      if (finishedCount >= imageUrls.length) {
        handleReady();
      }
    };

    // Preload all images in parallel
    const images = imageUrls.map((src) => {
      const img = new Image();
      img.onload = onFinish;
      img.onerror = onFinish; // Don't block on broken images
      img.src = src;
      // If already cached, onload fires synchronously in some browsers
      if (img.complete) {
        onFinish();
      }
      return img;
    });

    // Hard timeout — never block the app longer than 4 seconds
    const fallback = window.setTimeout(handleReady, 4000);

    return () => {
      active = false;
      window.clearTimeout(fallback);
    };
  }, [urlKey]);

  return ready;
}
