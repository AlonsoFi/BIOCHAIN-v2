import express, { Request, Response } from "express";
import { purchaseBioCredit, getMockBalance } from "../services/biocreditService";
import { getBioCreditBalance } from "../services/sorobanService";
import { validateBody, stellarAddressSchema } from "../utils/validation";
import { bioCreditPurchaseSchema } from "../utils/validation";
import { logInfo, logError } from "../utils/logger";
import { ValidationError } from "../utils/errors";

const router = express.Router();

/**
 * POST /api/biocredit/purchase
 * Simula compra fiat -> USDC -> BioCredit
 * Mint BioCredit al wallet del investigador
 */
router.post("/purchase", validateBody(bioCreditPurchaseSchema), async (req: Request, res: Response) => {
  try {
    const { walletAddress, amount } = req.body;

    logInfo('Processing BioCredit purchase', { 
      walletAddress: walletAddress.substring(0, 8) + '...',
      amount 
    });

    // Simular compra: fiat -> USDC -> BioCredit
    const result = await purchaseBioCredit(walletAddress, amount || 1);

    logInfo('BioCredit purchase successful', { 
      walletAddress: walletAddress.substring(0, 8) + '...',
      txHash: result.transactionHash 
    });

    res.status(200).json({
      success: true,
      message: "BioCredit comprado correctamente",
      data: result,
    });
  } catch (error) {
    logError("Error al comprar BioCredit", error);
    throw error; // Dejar que el error handler lo maneje
  }
});

/**
 * GET /api/biocredit/balance/:address
 * Obtiene el balance de BioCredits de una dirección
 */
router.get("/balance/:address", async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    // Validar formato de Stellar address
    try {
      stellarAddressSchema.parse(address);
    } catch (error) {
      throw new ValidationError("Formato de wallet address inválido");
    }
    
    // Consultar balance desde el contrato BioCreditToken
    const contractBalance = await getBioCreditBalance(address);
    
    // Si el contrato no está deployado, usar balance mock
    const mockBalance = getMockBalance(address);
    const balance = contractBalance > 0 ? contractBalance : mockBalance;
    
    res.json({
      success: true,
      balance,
    });
  } catch (error) {
    logError("Error al obtener balance", error);
    throw error; // Dejar que el error handler lo maneje
  }
});

export { router as biocreditRouter };

