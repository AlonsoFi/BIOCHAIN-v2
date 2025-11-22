import { useState, useEffect } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import { getStudiesByOwner } from "@/lib/soroban";

/**
 * Hook para obtener los estudios del contribuyente desde Soroban
 */
export const useStudies = () => {
  const { walletAddress } = useWalletContext();
  const [studies, setStudies] = useState<Array<{
    studyHash: string;
    timestamp: number;
    labIdentifier: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contract ID del StudyRegistry (debe ser configurado después del deploy)
  const STUDY_REGISTRY_CONTRACT_ID = process.env.NEXT_PUBLIC_STUDY_REGISTRY_CONTRACT_ID || "";

  useEffect(() => {
    const fetchStudies = async () => {
      if (!walletAddress || !STUDY_REGISTRY_CONTRACT_ID) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const studiesData = await getStudiesByOwner(
          STUDY_REGISTRY_CONTRACT_ID,
          walletAddress
        );
        setStudies(studiesData);
      } catch (err) {
        console.error("Error fetching studies:", err);
        setError("Error al cargar los estudios. Usando datos mock.");
        // En caso de error, usar datos mock
        const mockStudies = await getStudiesByOwner("", walletAddress);
        setStudies(mockStudies);
      } finally {
        setLoading(false);
      }
    };

    fetchStudies();
  }, [walletAddress]);

  return { studies, loading, error };
};

