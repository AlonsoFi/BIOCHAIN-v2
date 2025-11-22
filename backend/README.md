# BioChain Backend API

Backend API para BioChain - Gestión de Historial Clínico y Procesamiento de PDFs

## Descripción

Este backend implementa el flujo completo según el diagrama:

1. **Guardar Historial Clínico**: Endpoint para guardar historial clínico en DB (mock)
2. **Upload PDF**: Endpoint para subir y procesar PDFs
3. **Procesamiento de PDF (Mock NVIDIA CVM)**:
   - Remover PII (Personally Identifiable Information)
   - Detectar laboratorio (mock)
   - Extraer biomarcadores (mock)
   - Generar study_hash
   - Generar attestation_hash (mock)
4. **Validación de Duplicados**: Verifica si study_hash ya existe
5. **Guardar Metadata Anónima**: Guarda en Postgres (mock)
6. **Smart Contract**: Interacción con StudyRegistry (mock)

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3001`

## Producción

```bash
npm run build
npm start
```

## Endpoints

### Health Check
- `GET /health` - Verifica el estado del servidor

### Historial Clínico
- `POST /api/clinical-history` - Guarda historial clínico
- `GET /api/clinical-history/:id` - Obtiene historial clínico por ID

### PDF
- `POST /api/pdf/upload` - Sube y procesa un PDF

## Estructura

```
backend/
├── src/
│   ├── index.ts                 # Punto de entrada
│   ├── routes/                  # Rutas de la API
│   │   ├── clinicalHistory.ts
│   │   └── pdf.ts
│   ├── services/                # Lógica de negocio
│   │   ├── clinicalHistoryService.ts
│   │   └── pdfService.ts
│   └── middleware/              # Middlewares
│       └── errorHandler.ts
├── package.json
└── tsconfig.json
```

## Notas

- Por ahora todos los datos son mock (simulación)
- La base de datos es en memoria (se perderá al reiniciar)
- El procesamiento de PDFs es simulado
- Los hashes se generan usando SHA-256


