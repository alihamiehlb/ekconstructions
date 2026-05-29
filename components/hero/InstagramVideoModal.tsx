"use client";

import { getInstagramVideoEmbedUrl } from "@/lib/instagram-embed";
import { useSite } from "@/components/providers/SiteProvider";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useMemo } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function InstagramVideoModal({ open, onClose }: Props) {
  const site = useSite();
  const embedUrl = useMemo(() => getInstagramVideoEmbedUrl(), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Project video from Instagram"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ek-navy/90 backdrop-blur-md"
            aria-label="Close video"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-xl bg-ek-navy shadow-2xl"
            initial={{ y: 32, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.3em] text-ek-teal uppercase">
                  Our work
                </p>
                <h3 className="text-lg font-black text-white uppercase sm:text-xl">
                  Watch on Instagram
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/20 p-2 text-white transition hover:border-ek-teal hover:text-ek-teal"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {embedUrl ? (
              <div className="relative aspect-[9/16] w-full max-h-[70vh] bg-black sm:aspect-video sm:max-h-none">
                <iframe
                  src={embedUrl}
                  title="EK Constructions Instagram video"
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center px-6 py-16 text-center">
                <p className="max-w-md text-sm text-white/75">
                  Add your Instagram reel URL to{" "}
                  <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-ek-teal">
                    NEXT_PUBLIC_INSTAGRAM_VIDEO_URL
                  </code>{" "}
                  in <code className="text-white/90">.env.local</code> to play a video here.
                </p>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-8"
                >
                  Open @{site.instagram.handle}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 sm:px-6">
              <p className="text-xs text-white/60">
                Recent projects from @{site.instagram.handle}
              </p>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold tracking-wide text-ek-teal uppercase hover:underline"
              >
                View profile
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
