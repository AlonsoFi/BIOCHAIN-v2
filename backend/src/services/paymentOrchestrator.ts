/**
 * Payment Orchestrator (Backend)
 * Según el diagrama:
 * 1. Consumir 1 BioCredit -> transfer: researcher -> treasury
 * 2. Pagar a contribuyentes: 5 USDC per study_hash
 */

import { transferBioCredits, payContributors } from "./sorobanService";
import { consumeBioCredits } from "./biocreditService";
import { logInfo, logError, logWarn } from "../utils/logger";
import { env } from "../config/env";
import { CONSTANTS } from "../constants";

const TREASURY_WALLET = env.TREASURY_WALLET_ADDRESS || "";

interface PaymentResult {
  bioCreditConsumed: boolean;
  contributorsPaid: number;
  totalUSDC: number;
  transactionHashes: string[];
}

/**
 * Procesa los pagos según el diagrama
 */
export async function processPayment(
  researcherWallet: string,
  reportId: string,
  usedStudyHashes: string[]
): Promise<PaymentResult> {
  logInfo("Iniciando Payment Orchestrator", {
    researcherWallet: researcherWallet.substring(0, 8) + '...',
    reportId,
    studyHashesCount: usedStudyHashes.length
  });

  // Paso 1: Consumir 1 BioCredit -> transfer: researcher -> treasury
  logInfo("Consumiendo 1 BioCredit");
  
  // Primero consumir del balance mock
  const consumed = consumeBioCredits(researcherWallet, 1);
  if (!consumed) {
    throw new Error("Balance insuficiente de BioCredits");
  }
  
  // Luego hacer el transfer en blockchain (si el contrato está deployado)
  const transferResult = await transferBioCredits(researcherWallet, TREASURY_WALLET, 1);
  
  if (!transferResult.success) {
    logWarn("Transfer en blockchain falló, pero balance mock ya fue consumido");
  } else {
    logInfo("Transfer exitoso", { txHash: transferResult.txHash });
  }

  // Paso 2: Identificar contribuyentes de los study_hashes usados
  // TODO: En producción, leer los owners desde StudyRegistry contract usando los study_hashes
  // Por ahora usamos datos mock
  const contributors = [
    "contributor_wallet_1",
    "contributor_wallet_2",
    "contributor_wallet_3",
  ].slice(0, usedStudyHashes.length);

  logInfo(`Contribuyentes a pagar`, { count: contributors.length });

  // Paso 3: Pagar a contribuyentes: 5 USDC per study_hash
  logInfo("Pagando a contribuyentes", { 
    amountPerStudy: CONSTANTS.PAYMENT.USDC_PER_STUDY,
    count: usedStudyHashes.length 
  });
  
  const payments = usedStudyHashes.map((studyHash, index) => {
    const amount = CONSTANTS.PAYMENT.USDC_PER_STUDY;
    const contributor = contributors[index] || `contributor_${index}`;
    return {
      contributorAddress: contributor,
      studyHash,
      amount,
    };
  });

  const totalUSDC = payments.reduce((sum, p) => sum + p.amount, 0);
  logInfo("Total a pagar", { totalUSDC });

  // Llamar a PaymentContract.pay_contributors()
  const paymentResult = await payContributors(payments);
  
  if (!paymentResult.success) {
    logError("Error al pagar a contribuyentes", new Error(paymentResult.error || 'Unknown error'));
    throw new Error(`Error al pagar a contribuyentes: ${paymentResult.error}`);
  }
  
  logInfo("Pagos exitosos", { txHash: paymentResult.txHash });

  return {
    bioCreditConsumed: true,
    contributorsPaid: contributors.length,
    totalUSDC,
    transactionHashes: [
      transferResult.txHash || "",
      paymentResult.txHash || "",
    ].filter(Boolean),
  };
}

