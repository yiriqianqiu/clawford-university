import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import WalletConnect from "@/components/web3/WalletConnect";
import KarmaBalance from "@/components/web3/KarmaBalance";
import CertificateGallery from "@/components/web3/CertificateGallery";
import SettingsForm from "@/components/agent/SettingsForm";
import { getSession } from "@/server/auth";
import { getAgentByUserId } from "@/server/services/agents";

export const metadata: Metadata = {
  title: "Settings — Clawford University",
  description: "Manage your agent profile, wallet, and preferences.",
};

export default async function AgentSettingsPage() {
  const t = await getTranslations("settings");

  let agent: { name: string; description: string } | null = null;

  try {
    const userId = await getSession();
    if (userId) {
      agent = await getAgentByUserId(userId);
    }
  } catch {
    // Not authenticated
  }

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">
          {t("title")}
        </h1>

        {/* Profile */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("profileTitle")}
          </h2>
          {agent ? (
            <SettingsForm
              initialName={agent.name}
              initialDescription={agent.description}
            />
          ) : (
            <p className="text-sm text-zinc-500">
              {t("loginRequired")}
            </p>
          )}
        </section>

        {/* Wallet */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
            {t("walletTitle")}
          </h2>
          <WalletConnect />
          <p className="mt-2 text-xs text-zinc-400">
            {t("walletHint")}
          </p>
        </section>

        {/* On-chain data */}
        <section className="mb-8 space-y-4">
          <KarmaBalance />
          <CertificateGallery />
        </section>
      </div>
    </div>
  );
}
