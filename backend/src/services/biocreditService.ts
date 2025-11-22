/**
 * Servicio para manejar compras de BioCredits
 * Simula: fiat -> USDC -> BioCredit
 */

import { mintBioCredits } from "./sorobanService";
import { cache } from "../utils/cache";
import { CONSTANTS } from "../constants";
import { logInfo } from "../utils/logger";

// Mock database para balances (en memoria, se pierde al reiniciar)
const mockBalances: Record<string, number> = {};

interface PurchaseResult {
  walletAddress: string;
  amount: number;
  bioCreditsMinted: number;
  transactionHash?: string;
}

/**
 * Simula compra de BioCredit
 * 1. Simular conversión fiat -> USDC (mock)
 * 2. Validar compra
 * 3. Mint BioCredit al wallet (mock - en producción llamaría al contrato)
 */
export async function purchaseBioCredit(
  walletAddress: string,
  amount: number
): Promise<PurchaseResult> {
  // Simular delay de procesamiento
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simular conversión fiat -> USDC (mock)
  const usdAmount = amount * CONSTANTS.PAYMENT.BIOCREDIT_COST;
  logInfo("Simulando conversión fiat -> USDC", {
    usdAmount,
    usdcAmount: usdAmount,
    bioCredits: amount
  });

  // Validar compra (mock)
  logInfo("Compra validada");

  // Mint BioCredit al wallet del investigador
  logInfo("Mint de BioCredits al wallet del investigador", {
    walletAddress: walletAddress.substring(0, 8) + '...',
    amount
  });
  
  const mintResult = await mintBioCredits(walletAddress, amount);
  
  if (!mintResult.success) {
    logError("Error al hacer mint de BioCredits", new Error(mintResult.error || 'Unknown error'));
    throw new Error(`Error al hacer mint de BioCredits: ${mintResult.error}`);
  }
  
  logInfo("Mint exitoso", { txHash: mintResult.txHash });

  // Actualizar balance mock
  if (!mockBalances[walletAddress]) {
    mockBalances[walletAddress] = 0;
  }
  mockBalances[walletAddress] += amount;
  logInfo(`Balance actualizado`, { 
    walletAddress: walletAddress.substring(0, 8) + '...',
    newBalance: mockBalances[walletAddress]
  });
  
  // Invalidar caché de balance
  cache.delete(`balance:${walletAddress}`);

  return {
    walletAddress,
    amount,
    bioCreditsMinted: amount,
    transactionHash: mintResult.txHash,
  };
}

/**
 * Obtiene el balance mock de una wallet (con caché)
 */
export function getMockBalance(walletAddress: string): number {
  const cacheKey = `balance:${walletAddress}`;
  const cached = cache.get<number>(cacheKey);
  
  if (cached !== null) {
    return cached;
  }
  
  const balance = mockBalances[walletAddress] || 0;
  cache.set(cacheKey, balance, CONSTANTS.CACHE.BALANCE_TTL);
  
  return balance;
}

/**
 * Consume BioCredits (para cuando se genera un reporte)
 */
export function consumeBioCredits(walletAddress: string, amount: number): boolean {
  if (!mockBalances[walletAddress] || mockBalances[walletAddress] < amount) {
    return false;
  }
  mockBalances[walletAddress] -= amount;
  logInfo(`BioCredits consumidos`, { 
    walletAddress: walletAddress.substring(0, 8) + '...',
    amount,
    remaining: mockBalances[walletAddress]
  });
  
  // Invalidar caché de balance
  cache.delete(`balance:${walletAddress}`);
  
  return true;
}

