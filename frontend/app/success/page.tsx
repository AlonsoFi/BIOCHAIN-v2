"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Página de éxito después de subir PDF
 * Según el diagrama: Mostrar éxito de registro → Cargar Dashboard
 */
export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const studyHash = searchParams.get("studyHash");
  const laboratory = searchParams.get("laboratory");

  useEffect(() => {
    // Auto-redirigir al dashboard después de 5 segundos
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto border-green-500">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-black dark:text-zinc-50">
                ¡Estudio Registrado Exitosamente!
              </h2>
              <p className="text-muted-foreground mb-6">
                Tu estudio ha sido procesado y registrado en el ledger inmutable.
              </p>

              {studyHash && (
                <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg mb-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Study Hash:
                  </p>
                  <p className="text-sm font-mono break-all">
                    {studyHash.slice(0, 16)}...{studyHash.slice(-16)}
                  </p>
                </div>
              )}

              {laboratory && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Laboratorio: <span className="font-medium">{laboratory}</span>
                  </p>
                </div>
              )}

              <div className="space-y-2 mb-6">
                <p className="text-sm text-muted-foreground">
                  ✓ PDF procesado y PII removido
                </p>
                <p className="text-sm text-muted-foreground">
                  ✓ Biomarcadores extraídos
                </p>
                <p className="text-sm text-muted-foreground">
                  ✓ Metadatos anónimos guardados
                </p>
                <p className="text-sm text-muted-foreground">
                  ✓ Registrado en Smart Contract StudyRegistry
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push("/dashboard")}>
                  Ver Dashboard
                </Button>
                <Button variant="outline" onClick={() => router.push("/")}>
                  Subir Otro Estudio
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Serás redirigido al dashboard en 5 segundos...
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

