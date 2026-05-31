"use client";

import { GALLERY_FALLBACK_SRC, resolveGalleryImageSrc } from "@/lib/gallery-image";
import Image, { type ImageProps } from "next/image";
import { useCallback, useEffect, useState } from "react";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
  projectId?: string;
};

export function ProjectImage({ src, alt, projectId, onError, ...props }: Props) {
  const resolved = resolveGalleryImageSrc(src, projectId);
  const [imgSrc, setImgSrc] = useState(resolved);

  useEffect(() => {
    setImgSrc(resolveGalleryImageSrc(src, projectId));
  }, [src, projectId]);

  const handleError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (imgSrc !== GALLERY_FALLBACK_SRC) {
        setImgSrc(GALLERY_FALLBACK_SRC);
      }
      onError?.(event);
    },
    [imgSrc, onError],
  );

  const isRemote = imgSrc.startsWith("http");

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      unoptimized={isRemote}
    />
  );
}
