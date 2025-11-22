"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useWalletContext } from "@/providers/wallet.provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ReportFilters {
  rows?: string;
  columns?: string;
  laboratories?: string;
  biomarkers?: string;
  dateRange?: string;
  description?: string;
}

/**
 * Componente para solicitar reporte con filtros
 * Usuario define filtros: filas, cols, labs, biomarcadores...
 */
export const ReportRequestForm = ({ onReportGenerated }: { onReportGenerated: (reportId: string) => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<ReportFilters>({
    defaultValues: {
      rows: "",
      columns: "",
      laboratories: "",
      biomarkers: "",
      dateRange: "",
      description: "",
    },
  });

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  const { walletAddress } = useWalletContext();

  const onSubmit = async (data: ReportFilters) => {
    if (!walletAddress) {
      alert("Por favor conecta tu wallet primero");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/reports/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters: data,
          researcherWallet: walletAddress,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Error al generar reporte");
      }

      // Notificar que el reporte se generó
      onReportGenerated(result.data.reportId);
    } catch (error: any) {
      console.error("Error generating report:", error);
      alert(error.message || "Error al generar reporte");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitar Reporte</CardTitle>
        <CardDescription>
          Define los filtros para tu reporte personalizado. La IA interpretará tus requerimientos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Reporte</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Ej: Necesito un análisis de glucosa y colesterol de los últimos 6 meses de laboratorios en Buenos Aires..."
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </FormControl>
                  <FormDescription>
                    Describe qué información necesitas. La IA interpretará tus requerimientos.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="laboratories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Laboratorios (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: LAB_CENTRAL_001, LAB_QUEST_002"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Separa múltiples laboratorios con comas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="biomarkers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biomarcadores (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Glucosa, Colesterol, HDL"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Separa múltiples biomarcadores con comas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rango de Fechas (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Ej: últimos 6 meses"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? "Generando reporte..." : "Generar Reporte (1 BioCredit)"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

