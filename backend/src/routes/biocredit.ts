import express, { Request, Response } from "express";
import { purchaseBioCredit } from "../services/biocreditService";

const router = express.Router();

/**
 * POST /api/biocredit/purchase
 * Simula compra fiat -> USDC -> BioCredit
 * Mint BioCredit al wallet del investigador
 */
router.post("/purchase", async (req: Request, res: Response) => {
  try {
    const { walletAddress, amount } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: "walletAddress es requerido",
      });
    }

    // Simular compra: fiat -> USDC -> BioCredit
    const result = await purchaseBioCredit(walletAddress, amount || 1);

    res.status(200).json({
      success: true,
      message: "BioCredit comprado correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error al comprar BioCredit:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

/**
 * GET /api/biocredit/balance/:address
 * Obtiene el balance de BioCredits de una dirección
 */
router.get("/balance/:address", async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    // Por ahora retornamos mock
    // TODO: Consultar contrato real cuando esté deployado
    res.json({
      success: true,
      balance: 0, // Mock: retornar 0 para forzar compra
    });
  } catch (error) {
    console.error("Error al obtener balance:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

export { router as biocreditRouter };

