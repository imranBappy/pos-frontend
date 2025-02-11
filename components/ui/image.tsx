import React, { useEffect, useState } from 'react';
import Photo from 'next/image';
import NoImage from '@/assets/no-image.jpg'; // Ensure this is a static image

interface PROPS_TYPE {
    alt?: string;
    src?: Promise<string> | string | null; // Allow Promise, string, or null
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    sizes?: string;
}

const Image = ({
    alt = 'Image',
    src,
    width = 100,
    height = 100,
    className = '',
    priority = false,
    sizes,
}: PROPS_TYPE) => {
    const [resolvedSrc, setResolvedSrc] = useState<string | null>(null); // State to hold resolved URL
    const fallbackSrc = NoImage.src;
    useEffect(() => {
        if (typeof src === 'string') {
            setResolvedSrc(src);
        } else if (src instanceof Promise) {
            src.then((url) => setResolvedSrc(url)).catch(() => setResolvedSrc(null));
        } else {
            setResolvedSrc(null);
        }
    }, [src]);

    return (
        <Photo
            alt={alt}
            width={width}
            height={height}
            src={resolvedSrc || fallbackSrc}
            className={className}
            placeholder="blur"
            priority={priority}
            sizes={sizes}
            loading="lazy"
            blurDataURL={NoImage.blurDataURL || ''}
        />
    );
};

export default Image;
