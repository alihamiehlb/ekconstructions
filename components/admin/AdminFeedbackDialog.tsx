"use client";

import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { useEffect, useRef } from "react";

export type AdminFeedbackVariant = "loading" | "success" | "error" | "info";

export type AdminFeedbackDialogProps = {
  open: boolean;
  variant: AdminFeedbackVariant;
  title: string;
  lines?: string[];
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  onClose: () => void;
  onPrimary?: () => void;
};

export function AdminFeedbackDialog({
  open,
  variant,
  title,
  lines = [],
  primaryLabel = "OK",
  secondaryLabel,
  secondaryHref,
  onClose,
  onPrimary,
}: AdminFeedbackDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || variant === "loading") return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, variant, onClose]);

  useEffect(() => {
    if (open && variant !== "loading") {
      panelRef.current?.querySelector<HTMLButtonElement>("button[data-primary]")?.focus();
    }
  }, [open, variant, title]);

  if (!open) return null;

  const Icon =
    variant === "loading"
      ? Loader2
      : variant === "success"
        ? CheckCircle2
        : variant === "error"
          ? AlertCircle
          : AlertCircle;

  const iconClass =
    variant === "loading"
      ? "text-ek-teal animate-spin"
      : variant === "success"
        ? "text-emerald-600"
        : variant === "error"
          ? "text-red-600"
          : "text-ek-teal";

  return (
    <div
      className="admin-feedback-backdrop"
      role="presentation"
      onClick={variant === "loading" ? undefined : onClose}
    >
      <div
        ref={panelRef}
        className={`admin-feedback-panel admin-feedback-panel--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-feedback-title"
        aria-describedby={lines.length ? "admin-feedback-body" : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {variant !== "loading" && (
          <button
            type="button"
            className="admin-feedback-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}

        <div className="admin-feedback-icon-wrap">
          <Icon className={`h-10 w-10 ${iconClass}`} aria-hidden />
        </div>

        <h2 id="admin-feedback-title" className="admin-feedback-title">
          {title}
        </h2>

        {lines.length > 0 && (
          <ul id="admin-feedback-body" className="admin-feedback-lines">
            {lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}

        {variant !== "loading" && (
          <div className="admin-feedback-actions">
            {secondaryHref && secondaryLabel && (
              <a
                href={secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-feedback-btn admin-feedback-btn--secondary"
              >
                {secondaryLabel}
              </a>
            )}
            <button
              type="button"
              data-primary
              className="admin-feedback-btn admin-feedback-btn--primary"
              onClick={() => {
                onPrimary?.();
                onClose();
              }}
            >
              {primaryLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
