import { useState, useEffect } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import { getPaymentEvents } from "@/lib/soroban";

/**
 * Hook para obtener los pagos USDC (on-chain) del contribuyente
 */
export const usePayments = () => {
  const { walletAddress } = useWalletContext();
  const [payments, setPayments] = useState<Array<{
    reportId: string;
    amount: number;
    timestamp: number;
    studyHash?: string;
  }>>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contract ID del PaymentContract (debe ser configurado después del deploy)
  const PAYMENT_CONTRACT_ID = process.env.NEXT_PUBLIC_PAYMENT_CONTRACT_ID || "";

  useEffect(() => {
    const fetchPayments = async () => {
      if (!walletAddress) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const paymentEvents = await getPaymentEvents(
          PAYMENT_CONTRACT_ID,
          walletAddress
        );
        
        setPayments(paymentEvents);
        
        // Calcular total de earnings
        const total = paymentEvents.reduce((sum, payment) => sum + payment.amount, 0);
        setTotalEarnings(total);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Error al cargar los pagos. Usando datos mock.");
        // En caso de error, usar datos mock
        const mockPayments = await getPaymentEvents("", walletAddress);
        setPayments(mockPayments);
        const total = mockPayments.reduce((sum, p) => sum + p.amount, 0);
        setTotalEarnings(total);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [walletAddress]);

  return { payments, totalEarnings, loading, error };
};

