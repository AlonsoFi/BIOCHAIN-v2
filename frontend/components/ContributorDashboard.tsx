"use client";

import { useStudies } from "@/hooks/useStudies";
import { usePayments } from "@/hooks/usePayments";
import { useWalletContext } from "@/providers/wallet.provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Dashboard del Contribuyente
 * Muestra todos los estudios subidos con sus metadatos
 */
export const ContributorDashboard = () => {
  const { walletAddress } = useWalletContext();
  const { studies, loading, error } = useStudies();
  const { payments, totalEarnings, loading: paymentsLoading } = usePayments();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  if (!walletAddress) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Por favor, conecta tu wallet para ver tus estudios.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Dashboard del Contribuyente
          </h2>
          <p className="text-muted-foreground mt-1">
            Gestiona y visualiza todos tus estudios subidos
          </p>
        </div>
        <Button onClick={() => window.location.reload()}>
          Actualizar
        </Button>
      </div>

      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando estudios...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-yellow-500">
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <p className="text-yellow-600 dark:text-yellow-400">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && studies.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No tienes estudios registrados aún.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Sube tu primer análisis para comenzar.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && studies.length > 0 && (
        <div className="grid gap-4">
          {studies.map((study, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Estudio #{index + 1}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(study.timestamp)}
                  </span>
                </div>
                <CardDescription>
                  Laboratorio: {study.labIdentifier}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Study Hash:
                    </p>
                    <p className="text-sm font-mono bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded">
                      {formatHash(study.studyHash)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Timestamp: </span>
                      <span>{study.timestamp}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fecha: </span>
                      <span>{formatDate(study.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Sección de Pagos USDC (on-chain) */}
      {!paymentsLoading && payments.length > 0 && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pagos USDC (On-Chain)</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalEarnings} USDC
              </span>
            </CardTitle>
            <CardDescription>
              Historial de pagos recibidos cuando tus estudios son usados en reportes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      Reporte: {payment.reportId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(payment.timestamp)}
                    </p>
                    {payment.studyHash && (
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {formatHash(payment.studyHash)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      +{payment.amount} USDC
                    </p>
                    <p className="text-xs text-muted-foreground">On-chain</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen */}
      {!loading && studies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de Estudios</p>
                <p className="text-2xl font-semibold">{studies.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                  {totalEarnings} USDC
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Último Estudio</p>
                <p className="text-sm">
                  {studies.length > 0
                    ? formatDate(studies[0].timestamp)
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Laboratorios Únicos</p>
                <p className="text-2xl font-semibold">
                  {new Set(studies.map((s) => s.labIdentifier)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

