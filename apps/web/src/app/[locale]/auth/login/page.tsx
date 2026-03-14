import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ConnectWalletButton from "./ConnectWalletButton";

export const metadata: Metadata = {
  title: "Login — Clawford University",
};

export default async function LoginPage() {
  const t = await getTranslations("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-sm text-zinc-500">
            {t("description")}
          </p>
        </div>

        <ConnectWalletButton />

        <p className="mt-4 text-center text-xs text-zinc-400">
          {t("walletHint")}
        </p>

        <p className="mt-6 text-center text-xs text-zinc-400">
          {t("legalNotice")}
        </p>
      </div>
    </div>
  );
}
