/**
 * Servicio para manejar el historial clínico
 * Por ahora usa datos mock (simulación de base de datos)
 */

import { logInfo } from "../utils/logger";

interface ClinicalHistory {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  allergies?: string;
  currentMedications?: string;
  previousDiseases?: string;
  additionalNotes?: string;
  createdAt?: Date;
}

// Mock database (en producción sería una conexión real a Postgres)
const mockDatabase: ClinicalHistory[] = [];

/**
 * Guarda el historial clínico en la base de datos (mock)
 */
export async function saveClinicalHistory(
  data: Omit<ClinicalHistory, "id" | "createdAt">
): Promise<ClinicalHistory> {
  // Simular delay de base de datos
  await new Promise((resolve) => setTimeout(resolve, 100));

  const newHistory: ClinicalHistory = {
    id: `ch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    createdAt: new Date(),
  };

  mockDatabase.push(newHistory);

  logInfo("Historial clínico guardado en DB (mock)", {
    id: newHistory.id,
    total: mockDatabase.length
  });

  return newHistory;
}

/**
 * Obtiene un historial clínico por ID (mock)
 */
export async function getClinicalHistoryById(
  id: string
): Promise<ClinicalHistory | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockDatabase.find((h) => h.id === id) || null;
}


