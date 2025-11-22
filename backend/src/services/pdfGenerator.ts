/**
 * Servicio para generar PDFs de reportes
 */

import PDFDocument from "pdfkit";
import { GeneratedReport } from "./reportEngine";
import { logInfo, logError } from "../utils/logger";

/**
 * Genera un PDF del reporte
 */
export function generateReportPDF(report: GeneratedReport): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        logInfo("PDF generado", { reportId: report.reportId, size: pdfBuffer.length });
        resolve(pdfBuffer);
      });
      doc.on("error", (error) => {
        logError("Error al generar PDF", error);
        reject(error);
      });

      // Título
      doc.fontSize(20).text("Reporte de Análisis", { align: "center" });
      doc.moveDown();

      // Información del reporte
      doc.fontSize(12);
      doc.text(`ID del Reporte: ${report.reportId}`);
      doc.text(`Fecha de Generación: ${report.generatedAt.toLocaleString("es-ES")}`);
      doc.moveDown();

      // Estadísticas
      doc.fontSize(16).text("Estadísticas", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12);
      doc.text(`Total de Estudios: ${report.statistics.totalStudies}`);
      doc.text(`Biomarcadores: ${report.statistics.totalBiomarkers}`);
      doc.text(`Laboratorios: ${report.statistics.laboratories.length}`);
      doc.text(`Período: ${report.statistics.dateRange}`);
      doc.moveDown();

      // Filtros aplicados
      if (Object.keys(report.filters).length > 0) {
        doc.fontSize(16).text("Filtros Aplicados", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12);
        if (report.filters.description) {
          doc.text(`Descripción: ${report.filters.description}`);
        }
        if (report.filters.laboratories) {
          doc.text(`Laboratorios: ${report.filters.laboratories}`);
        }
        if (report.filters.biomarkers) {
          doc.text(`Biomarcadores: ${report.filters.biomarkers}`);
        }
        if (report.filters.dateRange) {
          doc.text(`Rango de Fechas: ${report.filters.dateRange}`);
        }
        doc.moveDown();
      }

      // Gráficos (nota)
      doc.fontSize(14).text("Gráficos", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      doc.text(
        "Los gráficos visuales están disponibles en la versión web del reporte.",
        { italic: true }
      );
      doc.moveDown();

      // Información de pago
      doc.fontSize(12);
      doc.text("Información de Transacción", { underline: true });
      doc.moveDown(0.5);
      doc.text("✓ 1 BioCredit consumido");
      doc.text("✓ Contribuyentes pagados: 5 USDC por cada estudio usado");
      doc.text(`✓ Total de estudios usados: ${report.usedStudyHashes.length}`);
      doc.moveDown();

      // Footer
      doc.fontSize(8);
      doc.text(
        "Este reporte fue generado por BioChain - Plataforma Blockchain para Datos Clínicos",
        { align: "center" }
      );

      doc.end();
    } catch (error) {
      logError("Error al crear documento PDF", error);
      reject(error);
    }
  });
}

