import React from 'react';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';

interface CloudinaryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  sizes?: string;
}

export function CloudinaryImage({ src, alt, sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw", ...props }: CloudinaryImageProps) {
  if (!src || !src.includes('res.cloudinary.com')) {
    return <img src={src} alt={alt} {...props} />;
  }

  const widths = [400, 800, 1200, 1600];
  const srcSet = widths.map(w => `${optimizeCloudinaryUrl(src, w)} ${w}w`).join(', ');
  const defaultSrc = optimizeCloudinaryUrl(src, 800);

  return (
    <img
      src={defaultSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      {...props}
    />
  );
}
