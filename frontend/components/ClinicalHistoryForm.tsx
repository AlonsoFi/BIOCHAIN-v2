"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useState } from "react";

// Instalar zod si no está instalado
// npm install zod @hookform/resolvers

const clinicalHistorySchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  dateOfBirth: z.string().min(1, "La fecha de nacimiento es requerida"),
  gender: z.enum(["masculino", "femenino", "otro"], {
    required_error: "Por favor selecciona un género",
  }),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
  previousDiseases: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type ClinicalHistoryFormValues = z.infer<typeof clinicalHistorySchema>;

/**
 * Componente de formulario para completar historial clínico
 * UI minimalista y fácil de entender
 */
export const ClinicalHistoryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ClinicalHistoryFormValues>({
    resolver: zodResolver(clinicalHistorySchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      gender: undefined,
      allergies: "",
      currentMedications: "",
      previousDiseases: "",
      additionalNotes: "",
    },
  });

  const onSubmit = async (data: ClinicalHistoryFormValues) => {
    setIsSubmitting(true);
    
    // Simular envío al backend (mock)
    try {
      // Aquí iría la llamada real al backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log("Datos del historial clínico:", data);
      
      // Mock: Simular respuesta del backend
      const mockResponse = {
        success: true,
        message: "Historial clínico enviado correctamente",
        data: data,
      };
      
      console.log("Respuesta del backend (mock):", mockResponse);
      
      setIsSubmitted(true);
      form.reset();
      
      // Resetear el estado después de 3 segundos
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error al enviar historial clínico:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Historial Clínico Enviado
            </h3>
            <p className="text-sm text-muted-foreground">
              Tu historial clínico ha sido enviado correctamente al backend.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Historial Clínico</CardTitle>
        <CardDescription>
          Completa tu historial clínico. Todos los campos marcados con * son
          obligatorios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Juan Pérez"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género *</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        disabled={isSubmitting}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Selecciona...</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alergias</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Penicilina, Polen"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Lista las alergias conocidas, separadas por comas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentMedications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicamentos Actuales</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Aspirina 100mg, Metformina 500mg"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Medicamentos que estás tomando actualmente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previousDiseases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enfermedades Previas</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Diabetes tipo 2, Hipertensión"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Enfermedades o condiciones médicas previas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionales</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Información adicional relevante..."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Limpiar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar al Backend"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};


