"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
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
import toast from "react-hot-toast";

interface ReportData {
  reportId: string;
  filters: any;
  statistics: {
    totalStudies: number;
    totalBiomarkers: number;
    dateRange: string;
    laboratories: string[];
  };
  charts: Array<{ type: string; data: any; title: string }>;
  usedStudyHashes: string[];
  generatedAt: string;
}

/**
 * Página para mostrar el reporte generado
 */
export default function ReportPage() {
  const params = useParams();
  const reportId = params.reportId as string;
  const router = useRouter();
  const { balance } = useBioCredits();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/reports/${reportId}`);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Error al cargar reporte");
        }
        
        setReport(data.data);
      } catch (error: any) {
        console.error("Error fetching report:", error);
        toast.error(error.message || "Error al cargar reporte");
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/reports/${reportId}/pdf`);
      
      if (!response.ok) {
        throw new Error("Error al generar PDF");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte_${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("PDF descargado correctamente");
    } catch (error: any) {
      console.error("Error downloading PDF:", error);
      toast.error(error.message || "Error al descargar PDF");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cargando reporte...</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Reporte no encontrado</p>
                <Button onClick={() => router.push("/researcher")} className="mt-4">
                  Volver al Panel
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const generatedDate = new Date(report.generatedAt).toLocaleString("es-ES");

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Reporte Generado</h1>
            <p className="text-muted-foreground">ID: {report.reportId}</p>
            <p className="text-sm text-muted-foreground">Generado: {generatedDate}</p>
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
                  <p className="text-2xl font-bold">{report.statistics.totalStudies}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Biomarcadores</p>
                  <p className="text-2xl font-bold">{report.statistics.totalBiomarkers}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Laboratorios</p>
                  <p className="text-2xl font-bold">{report.statistics.laboratories.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Período</p>
                  <p className="text-sm font-medium">{report.statistics.dateRange}</p>
                </div>
              </div>
            </div>

            {report.charts && report.charts.length > 0 && (
              <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Gráficos</h3>
                {report.charts.map((chart, index) => (
                  <div key={index} className="mt-4">
                    <p className="text-sm font-medium mb-2">{chart.title}</p>
                    <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded flex items-center justify-center">
                      <p className="text-muted-foreground">
                        {chart.type} - {chart.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-400">
                ✓ 1 BioCredit consumido
              </p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                ✓ Contribuyentes pagados: 5 USDC por cada estudio usado
              </p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                ✓ Estudios utilizados: {report.usedStudyHashes.length}
              </p>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => router.push("/researcher")}>
                Generar Otro Reporte
              </Button>
              <Button variant="outline" onClick={handleDownloadPDF}>
                Descargar PDF
              </Button>
              <Button variant="outline" onClick={() => router.push("/researcher/history")}>
                Ver Historial
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

