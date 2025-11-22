/**
 * Backend Report Engine (Mock AI)
 * Según el diagrama:
 * 1. Interpretar filtros (mock NLP)
 * 2. Seleccionar estudios en DB (synthetic dataset)
 * 3. Generar estadísticas + gráficos mock
 * 4. Identificar lista de study_hashes usados
 */

interface ReportFilters {
  description?: string;
  laboratories?: string;
  biomarkers?: string;
  dateRange?: string;
  rows?: string;
  columns?: string;
}

interface GeneratedReport {
  reportId: string;
  filters: ReportFilters;
  statistics: {
    totalStudies: number;
    totalBiomarkers: number;
    dateRange: string;
    laboratories: string[];
  };
  charts: Array<{
    type: string;
    data: any;
    title: string;
  }>;
  usedStudyHashes: string[];
  generatedAt: Date;
}

// Mock database de estudios (synthetic dataset)
const mockStudiesDataset = [
  {
    studyHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    laboratory: "LAB_CENTRAL_001",
    biomarkers: ["Glucosa: 95 mg/dL", "Colesterol Total: 180 mg/dL"],
    timestamp: Date.now() - 86400000,
  },
  {
    studyHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    laboratory: "LAB_QUEST_002",
    biomarkers: ["Triglicéridos: 120 mg/dL", "Hemoglobina: 14.5 g/dL"],
    timestamp: Date.now() - 172800000,
  },
  {
    studyHash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
    laboratory: "LAB_BIO_REF_003",
    biomarkers: ["Glucosa: 92 mg/dL", "HDL: 55 mg/dL"],
    timestamp: Date.now() - 259200000,
  },
];

/**
 * Interpreta filtros usando mock NLP
 */
function interpretFilters(filters: ReportFilters): {
  laboratories: string[];
  biomarkers: string[];
  dateRange: string;
} {
  const laboratories: string[] = [];
  const biomarkers: string[] = [];

  // Parsear laboratorios
  if (filters.laboratories) {
    laboratories.push(...filters.laboratories.split(",").map((l) => l.trim()));
  }

  // Parsear biomarcadores
  if (filters.biomarkers) {
    biomarkers.push(...filters.biomarkers.split(",").map((b) => b.trim()));
  }

  // Interpretar descripción (mock NLP)
  if (filters.description) {
    const desc = filters.description.toLowerCase();
    if (desc.includes("glucosa")) biomarkers.push("Glucosa");
    if (desc.includes("colesterol")) biomarkers.push("Colesterol");
    if (desc.includes("hdl")) biomarkers.push("HDL");
    if (desc.includes("triglicéridos")) biomarkers.push("Triglicéridos");
  }

  return {
    laboratories,
    biomarkers,
    dateRange: filters.dateRange || "últimos 6 meses",
  };
}

/**
 * Selecciona estudios del dataset según los filtros
 */
function selectStudies(filters: {
  laboratories: string[];
  biomarkers: string[];
}): typeof mockStudiesDataset {
  let selected = [...mockStudiesDataset];

  // Filtrar por laboratorios
  if (filters.laboratories.length > 0) {
    selected = selected.filter((s) =>
      filters.laboratories.some((lab) => s.laboratory.includes(lab))
    );
  }

  // Filtrar por biomarcadores
  if (filters.biomarkers.length > 0) {
    selected = selected.filter((s) =>
      filters.biomarkers.some((bm) =>
        s.biomarkers.some((sb) => sb.toLowerCase().includes(bm.toLowerCase()))
      )
    );
  }

  return selected;
}

/**
 * Genera estadísticas y gráficos mock
 */
function generateStatisticsAndCharts(
  studies: typeof mockStudiesDataset
): {
  statistics: GeneratedReport["statistics"];
  charts: GeneratedReport["charts"];
} {
  const allBiomarkers = new Set<string>();
  const allLaboratories = new Set<string>();

  studies.forEach((study) => {
    study.biomarkers.forEach((bm) => allBiomarkers.add(bm));
    allLaboratories.add(study.laboratory);
  });

  return {
    statistics: {
      totalStudies: studies.length,
      totalBiomarkers: allBiomarkers.size,
      dateRange: "últimos 6 meses",
      laboratories: Array.from(allLaboratories),
    },
    charts: [
      {
        type: "bar",
        title: "Distribución de Biomarcadores",
        data: {
          labels: Array.from(allBiomarkers).slice(0, 5),
          values: [10, 8, 6, 4, 2],
        },
      },
      {
        type: "pie",
        title: "Distribución por Laboratorio",
        data: {
          labels: Array.from(allLaboratories),
          values: [5, 3, 2],
        },
      },
    ],
  };
}

/**
 * Genera un reporte según los filtros
 */
export async function generateReport(
  filters: ReportFilters,
  researcherWallet: string
): Promise<GeneratedReport> {
  console.log("\n📊 Iniciando generación de reporte...");
  console.log("   - Filtros:", filters);
  console.log("   - Researcher:", researcherWallet);

  // Paso 1: Interpretar filtros (mock NLP)
  console.log("🤖 Interpretando filtros (mock NLP)...");
  const interpretedFilters = interpretFilters(filters);
  console.log("   - Laboratorios:", interpretedFilters.laboratories);
  console.log("   - Biomarcadores:", interpretedFilters.biomarkers);

  // Paso 2: Seleccionar estudios en DB (synthetic dataset)
  console.log("📚 Seleccionando estudios en DB (synthetic dataset)...");
  const selectedStudies = selectStudies(interpretedFilters);
  console.log(`   - Estudios seleccionados: ${selectedStudies.length}`);

  // Paso 3: Generar estadísticas + gráficos mock
  console.log("📈 Generando estadísticas + gráficos mock...");
  const { statistics, charts } = generateStatisticsAndCharts(selectedStudies);

  // Paso 4: Identificar lista de study_hashes usados
  const usedStudyHashes = selectedStudies.map((s) => s.studyHash);
  console.log(`   - Study hashes usados: ${usedStudyHashes.length}`);

  const reportId = `REPORT_${Date.now()}`;

  console.log("✅ Reporte generado:", reportId);

  return {
    reportId,
    filters,
    statistics,
    charts,
    usedStudyHashes,
    generatedAt: new Date(),
  };
}

