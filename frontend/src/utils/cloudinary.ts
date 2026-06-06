export function optimizeCloudinaryUrl(url: string, width?: number): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  
  let transforms = 'f_auto,q_auto';
  if (width) {
    transforms += `,w_${width},c_limit`;
  }

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex !== -1) {
    const before = url.substring(0, uploadIndex + 8);
    const after = url.substring(uploadIndex + 8);
    
    // Avoid double transforming if we already added it somehow
    if (after.startsWith('f_auto,q_auto')) {
      return url;
    }
    
    return `${before}${transforms}/${after}`;
  }
  return url;
}
