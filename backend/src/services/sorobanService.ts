/**
 * Servicio para interactuar con contratos Soroban
 * Maneja todas las interacciones con la blockchain
 */

import { logInfo, logError, logWarn } from "../utils/logger";
import { env } from "../config/env";

// Import opcional - si no está instalado, las funciones usarán mock
let Server: any, Contract: any, xdr: any;
try {
  const sdk = require("@stellar/stellar-sdk");
  Server = sdk.Server;
  Contract = sdk.Contract;
  xdr = sdk.xdr;
} catch (e) {
  logWarn("@stellar/stellar-sdk no instalado, usando modo mock completo");
}

// Configuración desde env validado
const SOROBAN_RPC_URL = env.SOROBAN_RPC_URL;
const NETWORK_PASSPHRASE = env.NETWORK_PASSPHRASE;

// Contract IDs (configurar en .env después de deployar)
const STUDY_REGISTRY_CONTRACT_ID = env.STUDY_REGISTRY_CONTRACT_ID || "";
const BIOCREDIT_TOKEN_CONTRACT_ID = env.BIOCREDIT_TOKEN_CONTRACT_ID || "";
const PAYMENT_CONTRACT_ID = env.PAYMENT_CONTRACT_ID || "";

// Treasury wallet para recibir BioCredits
const TREASURY_WALLET = env.TREASURY_WALLET_ADDRESS || "";

/**
 * Obtiene el servidor Soroban RPC
 */
function getSorobanServer(): any {
  if (!Server) {
    return null;
  }
  return new Server(SOROBAN_RPC_URL, { allowHttp: true });
}

/**
 * Convierte un string a BytesN<32> para Soroban
 */
function stringToBytes32(input: string): Buffer {
  const hash = require("crypto").createHash("sha256").update(input).digest();
  return hash.slice(0, 32);
}

/**
 * Convierte un string hex a Buffer
 */
function hexToBuffer(hex: string): Buffer {
  // Remover prefijo 0x si existe
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  return Buffer.from(cleanHex, "hex");
}

/**
 * Registra un estudio en el contrato StudyRegistry
 * 
 * @param ownerWallet - Dirección de la wallet del contribuyente
 * @param studyHash - Hash del estudio (hex string)
 * @param timestamp - Timestamp en segundos
 * @param labIdentifier - Identificador del laboratorio
 * @param attestationHash - Hash de attestation (hex string)
 */
export async function registerStudy(
  ownerWallet: string,
  studyHash: string,
  timestamp: number,
  labIdentifier: string,
  attestationHash: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    if (!STUDY_REGISTRY_CONTRACT_ID) {
      logWarn("STUDY_REGISTRY_CONTRACT_ID no configurado, usando mock");
      return {
        success: true,
        txHash: `mock_tx_${Date.now()}`,
      };
    }

    const server = getSorobanServer();
    if (!server || !Contract) {
      logWarn("Soroban SDK no disponible, usando mock");
      return {
        success: true,
        txHash: `mock_tx_${Date.now()}`,
      };
    }

    const contract = new Contract(STUDY_REGISTRY_CONTRACT_ID);

    // Convertir hashes a BytesN<32>
    const studyHashBytes = hexToBuffer(studyHash);
    const attestationHashBytes = hexToBuffer(attestationHash);

    // Preparar parámetros
    const params = [
      xdr.ScVal.scvBytes(studyHashBytes),
      xdr.ScVal.scvAddress(xdr.ScAddress.scAddressTypeAccount(xdr.PublicKey.publicKeyTypeEd25519(ownerWallet))),
      xdr.ScVal.scvU64(xdr.Uint64.fromString(timestamp.toString())),
      xdr.ScVal.scvSymbol(labIdentifier),
      xdr.ScVal.scvBytes(attestationHashBytes),
    ];

    // TODO: Crear y firmar transacción
    // Por ahora retornamos mock hasta que tengamos las keys configuradas
    logInfo("Llamando a register_study() en StudyRegistry contract", {
      contractId: STUDY_REGISTRY_CONTRACT_ID.substring(0, 8) + '...',
      ownerWallet: ownerWallet.substring(0, 8) + '...',
      studyHash: studyHash.substring(0, 16) + "..."
    });

    // Mock por ahora - en producción aquí se haría la transacción real
    return {
      success: true,
      txHash: `mock_tx_register_${Date.now()}`,
    };
  } catch (error: any) {
    logError("Error al registrar estudio en blockchain", error);
    return {
      success: false,
      error: error.message || "Error desconocido",
    };
  }
}

/**
 * Obtiene los study_hashes de un owner desde el contrato StudyRegistry
 */
export async function getStudyHashesByOwner(
  ownerAddress: string
): Promise<Array<{ studyHash: string; timestamp: number; labIdentifier: string; attestationHash?: string }>> {
  try {
    if (!STUDY_REGISTRY_CONTRACT_ID) {
      logWarn("STUDY_REGISTRY_CONTRACT_ID no configurado, usando mock");
      return [];
    }

    const server = getSorobanServer();
    if (!server) {
      logWarn("Soroban Server no disponible, usando mock");
      return [];
    }

    if (!Contract) {
      logWarn("@stellar/stellar-sdk no disponible, usando mock");
      return [];
    }

    const contract = new Contract(STUDY_REGISTRY_CONTRACT_ID);

    // TODO: Implementar llamada real cuando el contrato esté deployado
    // 1. Llamar a get_study_hashes_by_owner(ownerAddress)
    // 2. Para cada hash, llamar a get_study_data(studyHash)
    // 3. Retornar array con timestamp y labIdentifier
    
    logInfo("Leyendo study_hashes desde StudyRegistry", {
      ownerAddress: ownerAddress.substring(0, 8) + '...',
      contractId: STUDY_REGISTRY_CONTRACT_ID.substring(0, 8) + '...'
    });
    
    // Por ahora retornamos mock
    // Cuando el contrato esté deployado, aquí irá la lógica real
    return [];
  } catch (error: any) {
    console.error("❌ Error al leer study_hashes:", error);
    return [];
  }
}

/**
 * Obtiene el balance de BioCredits de una wallet
 */
export async function getBioCreditBalance(walletAddress: string): Promise<number> {
  try {
    if (!BIOCREDIT_TOKEN_CONTRACT_ID) {
      logWarn("BIOCREDIT_TOKEN_CONTRACT_ID no configurado, usando mock");
      return 0;
    }

    const server = getSorobanServer();
    if (!server || !Contract) {
      logWarn("Soroban SDK no disponible, usando mock");
      return 0;
    }

    const contract = new Contract(BIOCREDIT_TOKEN_CONTRACT_ID);

    // TODO: Llamar a balance() del contrato
    // Por ahora retornamos mock
    logInfo("Leyendo balance de BioCredits", {
      walletAddress: walletAddress.substring(0, 8) + '...'
    });

    return 0;
  } catch (error: any) {
    logError("Error al leer balance de BioCredits", error);
    return 0;
  }
}

/**
 * Hace mint de BioCredits a una wallet
 */
export async function mintBioCredits(
  toAddress: string,
  amount: number
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    if (!BIOCREDIT_TOKEN_CONTRACT_ID) {
      logWarn("BIOCREDIT_TOKEN_CONTRACT_ID no configurado, usando mock");
      return {
        success: true,
        txHash: `mock_tx_mint_${Date.now()}`,
      };
    }

    const server = getSorobanServer();
    if (!server || !Contract) {
      logWarn("Soroban SDK no disponible, usando mock");
      return {
        success: true,
        txHash: `mock_tx_mint_${Date.now()}`,
      };
    }

    const contract = new Contract(BIOCREDIT_TOKEN_CONTRACT_ID);

    // TODO: Llamar a mint() del contrato
    logInfo("Minting BioCredits", {
      amount,
      toAddress: toAddress.substring(0, 8) + '...'
    });

    return {
      success: true,
      txHash: `mock_tx_mint_${Date.now()}`,
    };
  } catch (error: any) {
    logError("Error al hacer mint de BioCredits", error);
    return {
      success: false,
      error: error.message || "Error desconocido",
    };
  }
}

/**
 * Transfiere BioCredits de una wallet a otra
 */
export async function transferBioCredits(
  fromAddress: string,
  toAddress: string,
  amount: number
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    if (!BIOCREDIT_TOKEN_CONTRACT_ID) {
      logWarn("BIOCREDIT_TOKEN_CONTRACT_ID no configurado, usando mock");
      return {
        success: true,
        txHash: `mock_tx_transfer_${Date.now()}`,
      };
    }

    const server = getSorobanServer();
    if (!server || !Contract) {
      logWarn("Soroban SDK no disponible, usando mock");
      return {
        success: true,
        txHash: `mock_tx_transfer_${Date.now()}`,
      };
    }

    const contract = new Contract(BIOCREDIT_TOKEN_CONTRACT_ID);

    // TODO: Llamar a transfer() del contrato
    logInfo("Transfiriendo BioCredits", {
      amount,
      fromAddress: fromAddress.substring(0, 8) + '...',
      toAddress: toAddress.substring(0, 8) + '...'
    });

    return {
      success: true,
      txHash: `mock_tx_transfer_${Date.now()}`,
    };
  } catch (error: any) {
    logError("Error al transferir BioCredits", error);
    return {
      success: false,
      error: error.message || "Error desconocido",
    };
  }
}

/**
 * Paga a contribuyentes usando el PaymentContract
 */
export async function payContributors(
  payments: Array<{ contributorAddress: string; studyHash: string; amount: number }>
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    if (!PAYMENT_CONTRACT_ID) {
      logWarn("PAYMENT_CONTRACT_ID no configurado, usando mock");
      return {
        success: true,
        txHash: `mock_tx_payment_${Date.now()}`,
      };
    }

    const server = getSorobanServer();
    if (!server || !Contract) {
      logWarn("Soroban SDK no disponible, usando mock");
      return {
        success: true,
        txHash: `mock_tx_payment_${Date.now()}`,
      };
    }

    const contract = new Contract(PAYMENT_CONTRACT_ID);

    // TODO: Llamar a pay_contributors() del contrato
    logInfo("Pagando a contribuyentes", {
      count: payments.length,
      totalUSDC: payments.reduce((sum, p) => sum + p.amount, 0)
    });

    return {
      success: true,
      txHash: `mock_tx_payment_${Date.now()}`,
    };
  } catch (error: any) {
    logError("Error al pagar a contribuyentes", error);
    return {
      success: false,
      error: error.message || "Error desconocido",
    };
  }
}

/**
 * Lee eventos PaymentMade desde el PaymentContract
 */
export async function getPaymentEvents(
  ownerAddress: string
): Promise<Array<{ reportId: string; amount: number; timestamp: number; studyHash?: string }>> {
  try {
    if (!PAYMENT_CONTRACT_ID) {
      logWarn("PAYMENT_CONTRACT_ID no configurado, usando mock");
      return [];
    }

    const server = getSorobanServer();
    if (!server) {
      logWarn("Soroban Server no disponible, usando mock");
      return [];
    }

    // TODO: Consultar eventos PaymentMade filtrados por ownerAddress
    logInfo("Leyendo eventos PaymentMade", {
      ownerAddress: ownerAddress.substring(0, 8) + '...'
    });

    return [];
  } catch (error: any) {
    logError("Error al leer eventos de pago", error);
    return [];
  }
}

