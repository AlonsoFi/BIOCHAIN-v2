import { useState, useEffect } from "react";
import { useWalletContext } from "@/providers/wallet.provider";

/**
 * Hook para obtener estudios filtrados desde el backend
 * Backend filtra biomarcadores + metadata anónima y envía al frontend
 */
export const useFilteredStudies = () => {
  const { walletAddress } = useWalletContext();
  const [filteredStudies, setFilteredStudies] = useState<Array<{
    studyHash: string;
    laboratory: string;
    biomarkers: string[];
    timestamp: number;
    attestationHash: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  useEffect(() => {
    const fetchFilteredStudies = async () => {
      if (!walletAddress) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/studies/filtered?ownerAddress=${walletAddress}`
        );

        if (!response.ok) {
          throw new Error("Error al obtener estudios filtrados");
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          setFilteredStudies(data.data);
        }
      } catch (err) {
        console.error("Error fetching filtered studies:", err);
        setError("Error al cargar estudios filtrados");
        // Datos mock en caso de error
        setFilteredStudies([
          {
            studyHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            laboratory: "LAB_CENTRAL_001",
            biomarkers: [
              "Glucosa: 95 mg/dL",
              "Colesterol Total: 180 mg/dL",
              "HDL: 55 mg/dL",
            ],
            timestamp: Date.now() - 86400000,
            attestationHash: "0xattestation_hash_1",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredStudies();
  }, [walletAddress]);

  return { filteredStudies, loading, error };
};

