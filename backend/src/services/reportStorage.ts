/**
 * Servicio para almacenar reportes generados
 * Mock storage (en producción sería una base de datos)
 */

import { GeneratedReport } from "./reportEngine";

// Mock database de reportes generados
const reportsDB: Map<string, GeneratedReport> = new Map();

/**
 * Guarda un reporte generado
 */
export function saveReport(report: GeneratedReport): void {
  reportsDB.set(report.reportId, report);
}

/**
 * Obtiene un reporte por ID
 */
export function getReportById(reportId: string): GeneratedReport | null {
  return reportsDB.get(reportId) || null;
}

/**
 * Obtiene todos los reportes de un investigador
 */
export function getReportsByResearcher(researcherWallet: string): GeneratedReport[] {
  const allReports = Array.from(reportsDB.values());
  // Filtrar por researcherWallet
  return allReports.filter((report) => report.researcherWallet === researcherWallet);
}

/**
 * Obtiene los últimos N reportes
 */
export function getRecentReports(limit: number = 10): GeneratedReport[] {
  const allReports = Array.from(reportsDB.values());
  // Ordenar por fecha (más recientes primero)
  allReports.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  return allReports.slice(0, limit);
}

