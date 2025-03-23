import React from 'react';
import Image from 'next/image';

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const ImagePreview = ({ src, alt, className, width = 400, height = 200 }: ImagePreviewProps) => {
  if (!src) return null;
  
  return (
    <div className={`relative ${className}`}>
      <Image 
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover rounded-lg"
        style={{ maxHeight: `${height}px` }}
      />
    </div>
  );
};

export default ImagePreview;
