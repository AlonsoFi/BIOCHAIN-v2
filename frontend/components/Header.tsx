"use client";

import { useWallet } from "@/hooks/wallet.hook";
import { useWalletContext } from "@/providers/wallet.provider";
import Link from "next/link";

/**
 * Header component with wallet connection button
 * Shows different states based on wallet connection status
 */
export const Header = () => {
  const { handleConnect, handleDisconnect } = useWallet();
  const { walletAddress, walletName } = useWalletContext();

  // Format wallet address to show first 6 and last 4 characters
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <h1 className="text-xl font-semibold text-black dark:text-zinc-50 cursor-pointer hover:opacity-80">
              BioChain
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/contributor"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
            >
              Contribuyente
            </Link>
            <Link
              href="/researcher"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
            >
              Investigador
            </Link>
            {walletAddress && (
              <Link
                href="/dashboard"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {walletAddress ? (
            <>
              <div className="text-sm hidden sm:block">
                <p className="font-medium text-black dark:text-zinc-50">
                  {walletName}
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                  {formatAddress(walletAddress)}
                </p>
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Desconectar
              </button>
            </>
          ) : (
            <button
              onClick={handleConnect}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Conectar Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

