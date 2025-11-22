import { useState, useEffect } from "react";
import { useWalletContext } from "@/providers/wallet.provider";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

/**
 * Hook para obtener el balance de BioCredits (on-chain)
 * Usa el backend que consulta el contrato BioCreditToken
 */
export const useBioCredits = () => {
  const { walletAddress } = useWalletContext();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchBalance = async () => {
    if (!walletAddress) {
      setBalance(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/biocredit/balance/${walletAddress}`);
      
      if (!response.ok) {
        throw new Error("Error al obtener balance");
      }

      const data = await response.json();
      setBalance(data.balance || 0);
    } catch (err) {
      console.error("Error fetching BioCredit balance:", err);
      setError("Error al cargar balance. Usando datos mock.");
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    
    // Refrescar balance cada 3 segundos (más frecuente para detectar cambios rápido)
    const interval = setInterval(fetchBalance, 3000);
    return () => clearInterval(interval);
  }, [walletAddress, refreshKey]);

  // Función para forzar refresh manual
  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return { balance, loading, error, refresh };
};

