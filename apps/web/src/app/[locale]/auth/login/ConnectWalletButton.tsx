"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function ConnectWalletButton() {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const router = useRouter();
  const t = useTranslations("login");

  useEffect(() => {
    if (isConnected) {
      router.push("/");
      router.refresh();
    }
  }, [isConnected, router]);

  return (
    <button
      onClick={() => open()}
      className="flex w-full items-center justify-center gap-3 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
      </svg>
      {t("connectWallet")}
    </button>
  );
}
