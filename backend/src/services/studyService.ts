/**
 * Servicio para filtrar biomarcadores + metadata anónima
 * Según el diagrama: Backend filtra y envía al Frontend
 */

import { logInfo } from "../utils/logger";

interface FilteredStudy {
  studyHash: string;
  laboratory: string;
  biomarkers: string[];
  timestamp: number;
  attestationHash: string;
}

// Mock database de estudios procesados (simula Postgres)
const mockStudiesDB: Array<{
  studyHash: string;
  ownerAddress: string;
  laboratory: string;
  biomarkers: string[];
  timestamp: number;
  attestationHash: string;
  processedAt: Date;
}> = [
  {
    studyHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    ownerAddress: "mock_owner_1",
    laboratory: "LAB_CENTRAL_001",
    biomarkers: [
      "Glucosa: 95 mg/dL",
      "Colesterol Total: 180 mg/dL",
      "HDL: 55 mg/dL",
      "LDL: 110 mg/dL",
    ],
    timestamp: Date.now() - 86400000,
    attestationHash: "0xattestation_hash_1",
    processedAt: new Date(Date.now() - 86400000),
  },
  {
    studyHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    ownerAddress: "mock_owner_1",
    laboratory: "LAB_QUEST_002",
    biomarkers: [
      "Triglicéridos: 120 mg/dL",
      "Hemoglobina: 14.5 g/dL",
      "Glucosa: 92 mg/dL",
    ],
    timestamp: Date.now() - 172800000,
    attestationHash: "0xattestation_hash_2",
    processedAt: new Date(Date.now() - 172800000),
  },
];

/**
 * Filtra biomarcadores + metadata anónima para un owner
 * Retorna solo los datos necesarios para el frontend (sin PII)
 */
export async function getFilteredStudies(
  ownerAddress: string,
  studyHash?: string
): Promise<FilteredStudy[]> {
  // Simular delay de base de datos
  await new Promise((resolve) => setTimeout(resolve, 100));

  let filtered: typeof mockStudiesDB;

  if (studyHash) {
    // Filtrar por studyHash específico
    filtered = mockStudiesDB.filter((s) => s.studyHash === studyHash);
  } else if (ownerAddress) {
    // Filtrar por owner
    filtered = mockStudiesDB.filter((s) => s.ownerAddress === ownerAddress);
  } else {
    filtered = [];
  }

  // Retornar solo metadata anónima (sin PII, sin ownerAddress)
  return filtered.map((study) => ({
    studyHash: study.studyHash,
    laboratory: study.laboratory,
    biomarkers: study.biomarkers,
    timestamp: study.timestamp,
    attestationHash: study.attestationHash,
  }));
}

/**
 * Agrega un estudio procesado a la base de datos (mock)
 * Esto se llama después de procesar un PDF
 */
export async function addProcessedStudy(study: {
  studyHash: string;
  ownerAddress: string;
  laboratory: string;
  biomarkers: string[];
  attestationHash: string;
}): Promise<void> {
  mockStudiesDB.push({
    ...study,
    timestamp: Date.now(),
    processedAt: new Date(),
  });

  logInfo("Estudio agregado a la base de datos (mock)", {
    studyHash: study.studyHash.substring(0, 16) + '...',
    total: mockStudiesDB.length
  });
}

