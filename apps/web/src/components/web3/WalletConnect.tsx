"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

export default function WalletConnect() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={() => open({ view: "Account" })}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          Manage
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
    >
      Connect Wallet
    </button>
  );
}
