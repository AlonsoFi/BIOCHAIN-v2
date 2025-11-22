import { useState, useEffect } from "react";
import { useWalletContext } from "@/providers/wallet.provider";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

/**
 * Hook para obtener los estudios del contribuyente
 * Usa el backend que combina datos de StudyRegistry (blockchain) + DB
 */
export const useStudies = () => {
  const { walletAddress } = useWalletContext();
  const [studies, setStudies] = useState<Array<{
    studyHash: string;
    laboratory: string;
    biomarkers: string[];
    timestamp: number;
    attestationHash: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudies = async () => {
      if (!walletAddress) {
        setStudies([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/studies/filtered?ownerAddress=${walletAddress}`
        );
        
        if (!response.ok) {
          throw new Error("Error al obtener estudios");
        }

        const data = await response.json();
        if (data.success && data.data) {
          setStudies(data.data);
        }
      } catch (err) {
        console.error("Error fetching studies:", err);
        setError("Error al cargar los estudios.");
        setStudies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudies();
    
    // Refrescar cada 10 segundos
    const interval = setInterval(fetchStudies, 10000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  return { studies, loading, error };
};

