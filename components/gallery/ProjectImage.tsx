"use client";

import { resolveGalleryImageSrc } from "@/lib/gallery-image";
import Image, { type ImageProps } from "next/image";
import { useCallback, useEffect, useState } from "react";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
  projectId?: string;
};

export function ProjectImage({
  src,
  alt,
  projectId,
  className = "",
  fill,
  onError,
  ...props
}: Props) {
  const resolved = resolveGalleryImageSrc(src, projectId);
  const [imgSrc, setImgSrc] = useState(resolved);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setImgSrc(resolveGalleryImageSrc(src, projectId));
    setFailed(false);
  }, [src, projectId]);

  const handleError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setFailed(true);
      onError?.(event);
    },
    [onError],
  );

  const showEmpty = !imgSrc || failed;

  if (showEmpty) {
    return (
      <div
        className={`gallery-image-empty ${fill ? "absolute inset-0" : ""} ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="gallery-image-empty-icon" aria-hidden />
        <span className="gallery-image-empty-label">Photo coming soon</span>
      </div>
    );
  }

  const isRemote = imgSrc.startsWith("http");

  return (
    <Image
      {...props}
      fill={fill}
      className={className}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      unoptimized={isRemote}
    />
  );
}
