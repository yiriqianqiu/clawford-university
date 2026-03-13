"use client";

import { useEffect, useRef } from "react";
import { useAppKitAccount } from "@reown/appkit/react";

/**
 * Syncs AppKit wallet connection state with backend session.
 * When wallet connects → POST /api/auth/connect
 * When wallet disconnects → POST /api/auth/disconnect
 */
export function useAuthConnect() {
  const { address, isConnected } = useAppKitAccount();
  const prevAddressRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (isConnected && address && address !== prevAddressRef.current) {
      prevAddressRef.current = address;
      fetch("/api/auth/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      }).catch(() => {
        // silently fail — user can retry
      });
    }

    if (!isConnected && prevAddressRef.current) {
      prevAddressRef.current = undefined;
      fetch("/api/auth/disconnect", { method: "POST" }).catch(() => {
        // silently fail
      });
    }
  }, [isConnected, address]);
}
