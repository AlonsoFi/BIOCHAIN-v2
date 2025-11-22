"use client";

import { useState } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";

/**
 * Componente para comprar BioCredits
 * Mock: Simula compra fiat -> USDC -> BioCredit
 */
export const BioCreditPurchase = ({ onPurchaseComplete }: { onPurchaseComplete: () => void }) => {
  const { walletAddress } = useWalletContext();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  const handlePurchase = async () => {
    if (!walletAddress) {
      toast.error("Por favor conecta tu wallet primero");
      return;
    }

    setIsPurchasing(true);

    try {
      const amount = 1; // 1 BioCredit = $60
      
      // Simular compra: fiat -> USDC -> BioCredit
      const response = await fetch(`${BACKEND_URL}/api/biocredit/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          amount,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al comprar BioCredit");
      }

      toast.success(`¡${amount} BioCredit(s) comprado(s) correctamente!`);
      
      // Notificar que la compra se completó
      onPurchaseComplete();
    } catch (error: any) {
      console.error("Error purchasing BioCredit:", error);
      const errorMessage = error.message || "Error al comprar BioCredit";
      toast.error(errorMessage);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Card className="border-blue-500">
      <CardHeader>
        <CardTitle>Comprar BioCredit</CardTitle>
        <CardDescription>
          1 BioCredit = $60 USD. Necesitas al menos 1 BioCredit para generar un reporte.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Proceso de compra (mock):
          </p>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>1. Pago fiat simulado → USDC</li>
            <li>2. Conversión USDC → BioCredit</li>
            <li>3. Mint de BioCredit a tu wallet</li>
          </ul>
        </div>

        <Button
          onClick={handlePurchase}
          disabled={isPurchasing || !walletAddress}
          className="w-full"
        >
          {isPurchasing ? "Procesando compra..." : "Comprar 1 BioCredit ($60)"}
        </Button>
      </CardContent>
    </Card>
  );
};

