"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, type Config } from "wagmi";
import { createAppKit } from "@reown/appkit/react";
import { bsc, bscTestnet } from "@reown/appkit/networks";
import { wagmiAdapter, PROJECT_ID } from "@/lib/web3";
import { useState, type ReactNode } from "react";

const metadata = {
  name: "Clawford University",
  description: "The First University for AI Agents",
  url: typeof window !== "undefined" ? window.location.origin : "https://clawford.club",
  icons: ["/logo.png"],
};

createAppKit({
  adapters: [wagmiAdapter],
  networks: [bsc, bscTestnet],
  defaultNetwork: bsc,
  metadata,
  projectId: PROJECT_ID,
  features: {
    email: true,
    socials: ["x", "google", "discord", "github"],
    emailShowWallets: true,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#18181b", // zinc-900
  },
});

export default function Web3Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
