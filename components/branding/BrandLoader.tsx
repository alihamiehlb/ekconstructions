"use client";

import { Logo } from "@/components/brand/Logo";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";

const MIN_MS = 2800;

export function BrandLoader() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"loading" | "exit" | "done">("loading");
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase === "exit" || phase === "done") {
      document.body.style.overflow = "";
    }
  }, [phase]);

  useEffect(() => {
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / MIN_MS) * 100));
      setProgress(pct);
      if (pct < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const finish = () => {
      setProgress(100);
      setPhase("exit");
      window.dispatchEvent(new CustomEvent("ek-brand-loader-done"));
      setTimeout(() => setPhase("done"), 650);
    };

    const wait = () => {
      const elapsed = performance.now() - start;
      setTimeout(finish, Math.max(0, MIN_MS - elapsed));
    };

    if (document.readyState === "complete") wait();
    else window.addEventListener("load", wait, { once: true });

    return () => cancelAnimationFrame(frame);
  }, []);

  if (phase === "done") return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="brand-loader"
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white px-6"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col items-center">
          <motion.div
            initial={{
              opacity: 0,
              y: reduceMotion ? 0 : 18,
              filter: reduceMotion ? "blur(0px)" : "blur(10px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: reduceMotion ? 0.25 : 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Logo size="loader" asLink={false} />
          </motion.div>

          <motion.div
            className="mt-5 h-[2px] origin-center rounded-full bg-ek-orange"
            initial={{ width: 0, opacity: 0.4 }}
            animate={{ width: 120, opacity: 1 }}
            transition={{
              delay: reduceMotion ? 0.1 : 0.55,
              duration: reduceMotion ? 0.3 : 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-hidden
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0.15 : 0.95, duration: 0.5 }}
            className="mt-6 text-[10px] font-medium tracking-[0.42em] text-ek-muted uppercase"
          >
            Sydney construction
          </motion.p>
        </div>

        <div className="absolute inset-x-0 bottom-10 px-8 sm:bottom-12">
          <div
            className="mx-auto h-[2px] max-w-xs overflow-hidden rounded-full bg-ek-gray"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Loading progress"
          >
            <motion.div
              className="h-full rounded-full bg-ek-orange/80"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
