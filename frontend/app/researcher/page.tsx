"use client";

import { useState } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import { useBioCredits } from "@/hooks/useBioCredits";
import { BioCreditPurchase } from "@/components/BioCreditPurchase";
import { ReportRequestForm } from "@/components/ReportRequestForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

/**
 * Página del Investigador
 * Flujo completo según el diagrama
 */
export default function ResearcherPage() {
  const { walletAddress } = useWalletContext();
  const { balance, loading: balanceLoading, refresh } = useBioCredits();
  const [showPurchase, setShowPurchase] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const router = useRouter();

  const handlePurchaseComplete = () => {
    setShowPurchase(false);
    // Forzar refresh inmediato del balance
    setTimeout(() => {
      refresh();
    }, 500);
  };

  const handleReportGenerated = (generatedReportId: string) => {
    setReportId(generatedReportId);
    // Redirigir a página de reporte
    router.push(`/researcher/report/${generatedReportId}`);
  };

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Por favor, conecta tu wallet para acceder al panel del investigador.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Si balance = 0, mostrar opción de compra
  if (!balanceLoading && balance === 0 && !showPurchase) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <main className="container mx-auto px-4 py-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-semibold mb-2">Panel del Investigador</h1>
            <p className="text-muted-foreground">
              Necesitas BioCredits para generar reportes
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-yellow-500">
              <CardHeader>
                <CardTitle>Sin BioCredits</CardTitle>
                <CardDescription>
                  Tu balance de BioCredits es 0. Necesitas al menos 1 BioCredit para generar un reporte.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <button
                  onClick={() => setShowPurchase(true)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Comprar BioCredits
                </button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Panel del Investigador</h1>
            <p className="text-muted-foreground">
              Genera reportes personalizados con IA
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              onClick={() => router.push("/researcher/history")}
            >
              Ver Historial
            </Button>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">BioCredits</p>
              <p className="text-2xl font-bold">
                {balanceLoading ? "..." : balance}
              </p>
            </div>
          </div>
        </div>

        {showPurchase && (
          <div className="max-w-2xl mx-auto">
            <BioCreditPurchase onPurchaseComplete={handlePurchaseComplete} />
          </div>
        )}

        {!showPurchase && balance > 0 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <ReportRequestForm onReportGenerated={handleReportGenerated} />
          </div>
        )}
      </main>
    </div>
  );
}

