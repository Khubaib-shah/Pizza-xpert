export function flyToCart(sourceElement: HTMLElement) {
  const targetElement = document.getElementById('cart-icon-destination');
  if (!sourceElement || !targetElement) return;

  // Clone the source element
  const clone = sourceElement.cloneNode(true) as HTMLElement;
  
  // Get bounding rects
  const startRect = sourceElement.getBoundingClientRect();
  const endRect = targetElement.getBoundingClientRect();

  // Create outer container for X axis (Linear)
  const outerDiv = document.createElement('div');
  outerDiv.style.position = 'fixed';
  outerDiv.style.top = `${startRect.top}px`;
  outerDiv.style.left = `${startRect.left}px`;
  outerDiv.style.width = `${startRect.width}px`;
  outerDiv.style.height = `${startRect.height}px`;
  outerDiv.style.zIndex = '999999';
  outerDiv.style.pointerEvents = 'none'; // Don't block UI
  
  // Clean up any hover states or transitions from the original
  clone.style.margin = '0';
  clone.style.position = 'absolute';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.width = '100%';
  clone.style.height = '100%';
  clone.style.transition = 'none';
  clone.style.transform = 'none';
  // Add a nice floating shadow and shape
  clone.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
  clone.style.borderRadius = '50%'; 
  clone.style.objectFit = 'cover';

  // Calculate distances to the exact center of the target icon
  const destX = endRect.left - startRect.left + (endRect.width / 2) - (startRect.width / 2);
  const destY = endRect.top - startRect.top + (endRect.height / 2) - (startRect.height / 2);

  // Setup transitions
  // Outer moves horizontally (linear)
  outerDiv.style.transition = 'transform 0.5s linear';
  // Inner moves vertically (ease-in gravity effect) and scales down/fades
  clone.style.transition = 'transform 0.5s cubic-bezier(0.5, 0, 1, 0.5), opacity 0.5s ease-in';

  outerDiv.appendChild(clone);
  document.body.appendChild(outerDiv);

  // Force a reflow so the browser registers the initial positions before applying the transform
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  outerDiv.offsetHeight;

  // Apply end states (fly to dest, shrink, rotate slightly, and fade)
  outerDiv.style.transform = `translateX(${destX}px)`;
  clone.style.transform = `translateY(${destY}px) scale(0.15) rotate(45deg)`;
  clone.style.opacity = '0.3';

  // Cleanup after animation completes
  setTimeout(() => {
    if (document.body.contains(outerDiv)) {
      document.body.removeChild(outerDiv);
    }
  }, 500);
}
