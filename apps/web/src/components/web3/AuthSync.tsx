"use client";

import { useAuthConnect } from "@/hooks/useAuthConnect";

/**
 * Invisible component that syncs AppKit wallet state with backend sessions.
 * Place in the root layout so it runs on every page.
 */
export default function AuthSync() {
  useAuthConnect();
  return null;
}
