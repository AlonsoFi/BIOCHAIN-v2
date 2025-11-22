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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/**
 * Componente para subir PDF de estudio
 * Según el diagrama: Upload PDF de estudio → Backend procesa
 */
export const PDFUploadForm = () => {
  const { walletAddress } = useWalletContext();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Solo se permiten archivos PDF");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor selecciona un archivo PDF");
      return;
    }

    if (!walletAddress) {
      setError("Por favor conecta tu wallet primero");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("ownerWallet", walletAddress);

      const response = await fetch(`${BACKEND_URL}/api/pdf/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al subir el PDF");
      }

      toast.success("PDF procesado correctamente");
      
      // Redirigir a página de éxito con los datos
      const studyHash = data.data?.studyHash || "";
      router.push(`/success?studyHash=${studyHash}&laboratory=${data.data?.laboratory || ""}`);
    } catch (err: any) {
      console.error("Error uploading PDF:", err);
      const errorMessage = err.message || "Error al subir el PDF. Por favor intenta nuevamente.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  if (!walletAddress) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Por favor, conecta tu wallet para subir un estudio.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Subir PDF de Estudio</CardTitle>
        <CardDescription>
          Sube tu análisis médico en formato PDF. El sistema procesará automáticamente
          tu documento de forma segura y anónima.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Seleccionar archivo PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {file && (
            <p className="mt-2 text-sm text-muted-foreground">
              Archivo seleccionado: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? "Subiendo y procesando..." : "Subir PDF"}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• El PDF será procesado automáticamente</p>
          <p>• Se removerá toda información personal (PII)</p>
          <p>• Se extraerán biomarcadores y metadatos</p>
          <p>• El estudio se registrará en el ledger inmutable</p>
        </div>
      </CardContent>
    </Card>
  );
};

