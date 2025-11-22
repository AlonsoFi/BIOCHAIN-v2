"use client";

import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useBioCredits } from "@/hooks/useBioCredits";

/**
 * Página para mostrar el reporte generado
 */
export default function ReportPage() {
  const params = useParams();
  const reportId = params.reportId as string;
  const router = useRouter();
  const { balance } = useBioCredits();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Reporte Generado</h1>
            <p className="text-muted-foreground">ID: {reportId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">BioCredits Restantes</p>
            <p className="text-2xl font-bold">{balance}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reporte de Análisis</CardTitle>
            <CardDescription>
              Reporte generado con IA basado en el dataset global
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Estadísticas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Estudios</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Biomarcadores</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Laboratorios</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Período</p>
                  <p className="text-sm font-medium">Últimos 6 meses</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Gráficos</h3>
              <p className="text-sm text-muted-foreground">
                Gráficos mock generados (en producción mostraría gráficos reales)
              </p>
              <div className="mt-4 h-48 bg-zinc-200 dark:bg-zinc-800 rounded flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico de barras - Distribución de Biomarcadores</p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-400">
                ✓ 1 BioCredit consumido
              </p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                ✓ Contribuyentes pagados: 5 USDC por cada estudio usado
              </p>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => router.push("/researcher")}>
                Generar Otro Reporte
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                Descargar PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

