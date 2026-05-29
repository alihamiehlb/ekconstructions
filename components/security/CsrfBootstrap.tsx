"use client";

import { useEffect } from "react";
import { getCsrfToken } from "@/lib/security/client-fetch";

export function CsrfBootstrap() {
  useEffect(() => {
    getCsrfToken().catch(() => {});
  }, []);
  return null;
}
