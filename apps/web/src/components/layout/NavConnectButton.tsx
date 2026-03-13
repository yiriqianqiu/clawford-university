"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NavConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const t = useTranslations("nav");

  if (isConnected && address) {
    return (
      <button
        onClick={() => open({ view: "Account" })}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        <span className="font-mono">{address.slice(0, 4)}...{address.slice(-3)}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {t("login")}
    </button>
  );
}
