/**
 * Servicio para interactuar con Soroban RPC
 * Lee study_hashes por owner, timestamp y lab_identifier según el diagrama
 */

/**
 * Configuración de Soroban RPC
 */
const SOROBAN_RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 
  "https://soroban-testnet.stellar.org:443";

/**
 * Obtiene todos los estudios de un owner con sus metadatos
 * Esta función hace la llamada a Soroban RPC según el diagrama:
 * - Lee study_hashes por owner
 * - Lee timestamp y lab_identifier
 */
export async function getStudiesByOwner(
  contractId: string,
  ownerAddress: string
): Promise<Array<{
  studyHash: string;
  timestamp: number;
  labIdentifier: string;
}>> {
  // Si no hay contract ID, retornar datos mock para desarrollo
  if (!contractId) {
    console.log("No contract ID provided, using mock data");
    return getMockStudies();
  }

  try {
    // Llamada a Soroban RPC para leer study_hashes por owner
    // y leer timestamp y lab_identifier
    // Nota: En producción, usar @soroban/client o @stellar/stellar-sdk
    
    // Por ahora, retornamos datos mock
    // TODO: Implementar llamada real a Soroban RPC cuando el contrato esté deployado
    console.log("Fetching studies from Soroban RPC for owner:", ownerAddress);
    console.log("Contract ID:", contractId);
    
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Retornar datos mock
    return getMockStudies();
  } catch (error) {
    console.error("Error fetching studies by owner:", error);
    // En caso de error, retornar datos mock
    return getMockStudies();
  }
}

/**
 * Lee eventos de pago desde PaymentContract (on-chain)
 * Eventos PaymentMade cuando un estudio es usado en un reporte
 */
export async function getPaymentEvents(
  contractId: string,
  ownerAddress: string
): Promise<Array<{
  reportId: string;
  amount: number; // En USDC (5 USDC = 50000000 unidades)
  timestamp: number;
  studyHash?: string;
}>> {
  // Si no hay contract ID, retornar datos mock
  if (!contractId) {
    console.log("No contract ID provided, using mock payment data");
    return getMockPayments();
  }

  try {
    // Llamada a Soroban RPC para leer eventos PaymentMade
    // TODO: Implementar llamada real cuando el contrato esté deployado
    console.log("Fetching payment events from Soroban RPC for owner:", ownerAddress);
    
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Retornar datos mock
    return getMockPayments();
  } catch (error) {
    console.error("Error fetching payment events:", error);
    return getMockPayments();
  }
}

/**
 * Datos mock para desarrollo (cuando el contrato no está deployado)
 * Simula la respuesta de Soroban RPC con study_hashes, timestamp y lab_identifier
 */
function getMockStudies(): Array<{
  studyHash: string;
  timestamp: number;
  labIdentifier: string;
}> {
  return [
    {
      studyHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      timestamp: Date.now() - 86400000, // Hace 1 día
      labIdentifier: "LAB_CENTRAL_001",
    },
    {
      studyHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      timestamp: Date.now() - 172800000, // Hace 2 días
      labIdentifier: "LAB_QUEST_002",
    },
    {
      studyHash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
      timestamp: Date.now() - 259200000, // Hace 3 días
      labIdentifier: "LAB_BIO_REF_003",
    },
  ];
}

/**
 * Datos mock de pagos USDC (on-chain)
 * Simula eventos PaymentMade del contrato
 */
function getMockPayments(): Array<{
  reportId: string;
  amount: number;
  timestamp: number;
  studyHash?: string;
}> {
  return [
    {
      reportId: "REPORT_001",
      amount: 5, // 5 USDC
      timestamp: Date.now() - 3600000, // Hace 1 hora
      studyHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
    {
      reportId: "REPORT_002",
      amount: 5, // 5 USDC
      timestamp: Date.now() - 7200000, // Hace 2 horas
      studyHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
    {
      reportId: "REPORT_003",
      amount: 5, // 5 USDC
      timestamp: Date.now() - 10800000, // Hace 3 horas
      studyHash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
    },
  ];
}
