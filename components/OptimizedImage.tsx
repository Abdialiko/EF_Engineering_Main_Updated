'use client';
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  loading,
  onError,
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImgSrc('/images/hero/2.webp'); // Fallback image
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // For external images, use regular img tag with optimization
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          loading={loading || 'lazy'}
          onError={handleError}
          onLoad={handleLoad}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </div>
    );
  }

  // For local images, use Next.js Image component
  if (fill) {
    return (
      <div className={`relative ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
        )}
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          sizes={sizes}
          quality={quality}
          priority={priority}
          loading={loading}
          onError={handleError}
          onLoad={handleLoad}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default OptimizedImage;

