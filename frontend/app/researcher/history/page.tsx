"use client";

import { useState, useEffect } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Report {
  reportId: string;
  filters: any;
  statistics: {
    totalStudies: number;
    totalBiomarkers: number;
    dateRange: string;
    laboratories: string[];
  };
  generatedAt: string;
  usedStudyHashes: string[];
}

/**
 * Página de historial de reportes generados
 */
export default function ReportHistoryPage() {
  const { walletAddress } = useWalletContext();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  useEffect(() => {
    const fetchReports = async () => {
      if (!walletAddress) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/reports?researcherWallet=${walletAddress}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Error al cargar reportes");
        }

        setReports(data.data || []);
      } catch (error: any) {
        console.error("Error fetching reports:", error);
        toast.error(error.message || "Error al cargar historial");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [walletAddress]);

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Por favor, conecta tu wallet para ver tu historial de reportes.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cargando historial...</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Historial de Reportes</h1>
            <p className="text-muted-foreground">
              Todos los reportes que has generado
            </p>
          </div>
          <Button onClick={() => router.push("/researcher")}>
            Generar Nuevo Reporte
          </Button>
        </div>

        {reports.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No has generado ningún reporte aún.
                </p>
                <Button onClick={() => router.push("/researcher")}>
                  Generar Primer Reporte
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const generatedDate = new Date(report.generatedAt).toLocaleString("es-ES");
              return (
                <Card key={report.reportId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{report.reportId}</CardTitle>
                        <CardDescription>
                          Generado: {generatedDate}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/researcher/report/${report.reportId}`)}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Estudios</p>
                        <p className="text-lg font-semibold">
                          {report.statistics.totalStudies}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Biomarcadores</p>
                        <p className="text-lg font-semibold">
                          {report.statistics.totalBiomarkers}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Laboratorios</p>
                        <p className="text-lg font-semibold">
                          {report.statistics.laboratories.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Período</p>
                        <p className="text-sm font-medium">
                          {report.statistics.dateRange}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

