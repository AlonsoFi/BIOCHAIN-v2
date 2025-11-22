import { useState, useEffect } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import { getBioCreditBalance } from "@/lib/biocredit";

/**
 * Hook para obtener el balance de BioCredits (on-chain)
 */
export const useBioCredits = () => {
  const { walletAddress } = useWalletContext();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BIOCREDIT_CONTRACT_ID = process.env.NEXT_PUBLIC_BIOCREDIT_CONTRACT_ID || "";

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress) {
        setBalance(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const bioCreditBalance = await getBioCreditBalance(
          BIOCREDIT_CONTRACT_ID,
          walletAddress
        );
        setBalance(bioCreditBalance);
      } catch (err) {
        console.error("Error fetching BioCredit balance:", err);
        setError("Error al cargar balance. Usando datos mock.");
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    
    // Refrescar balance cada 10 segundos
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  return { balance, loading, error };
};

