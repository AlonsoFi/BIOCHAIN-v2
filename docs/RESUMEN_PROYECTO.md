# BioChain - Resumen del Proyecto

## 🎯 Descripción

BioChain es una plataforma blockchain para gestión de datos clínicos que permite a los contribuyentes subir sus análisis médicos y ganar USDC cuando son utilizados en reportes, mientras que los investigadores pueden generar reportes personalizados con IA usando el dataset global.

## 🏗️ Arquitectura

### Frontend (Next.js + React)
- **Página Principal**: Selección entre Contribuyente e Investigador
- **Panel Contribuyente**: 
  - Formulario de historial clínico
  - Upload de PDFs de estudios
  - Dashboard con estudios y earnings
- **Panel Investigador**:
  - Consulta de BioCredits balance
  - Compra de BioCredits
  - Solicitud de reportes con filtros
  - Visualización de reportes generados

### Backend (Node.js + Express)
- **API de Historial Clínico**: Guarda historial clínico en DB
- **API de PDFs**: Procesa PDFs (Mock NVIDIA CVM)
- **API de Estudios**: Filtra biomarcadores y metadata anónima
- **API de BioCredits**: Maneja compras de BioCredits
- **Report Engine**: Genera reportes con IA (Mock)
- **Payment Orchestrator**: Orquesta pagos a contribuyentes

### Smart Contracts (Soroban)
- **PaymentContract**: Paga USDC a contribuyentes (5 USDC por estudio usado)
- **StudyRegistry**: Registra estudios en ledger inmutable
- **BioCreditToken**: Maneja BioCredits (1 BioCredit = $60)

## 🔄 Flujos Implementados

### Flujo del Contribuyente
1. Login con wallet → Asignar/Recuperar Stellar Address
2. Completar historial clínico → Guardar en DB
3. Subir PDF de estudio → Procesar (remover PII, extraer biomarcadores)
4. Registrar en StudyRegistry → Ledger inmutable
5. Ver dashboard → Estudios y pagos USDC recibidos

### Flujo del Investigador
1. Login con wallet → Asignar/Recuperar Stellar Address
2. Ver BioCredits balance → Consultar Soroban RPC
3. Si balance = 0 → Comprar BioCredits (fiat → USDC → BioCredit)
4. Definir filtros del reporte → Formulario con descripción y filtros
5. Backend genera reporte → Report Engine (Mock AI)
6. Payment Orchestrator → Consume 1 BioCredit y paga contribuyentes
7. Mostrar reporte → Estadísticas y gráficos

## 📁 Estructura del Proyecto

```
BIOCHAIN/
├── frontend/              # Next.js App
│   ├── app/
│   │   ├── page.tsx      # Página principal (2 cards)
│   │   ├── contributor/  # Panel contribuyente
│   │   ├── researcher/   # Panel investigador
│   │   ├── dashboard/    # Dashboard contribuyente
│   │   └── success/      # Página de éxito
│   ├── components/        # Componentes React
│   ├── hooks/            # Custom hooks
│   └── lib/              # Servicios y utilidades
│
├── backend/               # Node.js API
│   ├── src/
│   │   ├── routes/       # Endpoints
│   │   ├── services/     # Lógica de negocio
│   │   └── middleware/   # Middlewares
│
└── contracts/            # Smart Contracts Soroban
    ├── payment_contract/ # Pagos USDC
    ├── study_registry/   # Registro de estudios
    └── biocredit_token/  # Tokens BioCredit
```

## 🚀 Comandos de Inicio

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Contratos
```bash
cd contracts
soroban contract build
```

## 🔑 Variables de Entorno

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org:443
NEXT_PUBLIC_STUDY_REGISTRY_CONTRACT_ID=
NEXT_PUBLIC_PAYMENT_CONTRACT_ID=
NEXT_PUBLIC_BIOCREDIT_CONTRACT_ID=
```

### Backend (.env)
```
PORT=3001
NODE_ENV=development
```

## ✅ Estado del Proyecto

- ✅ Flujo del Contribuyente completo
- ✅ Flujo del Investigador completo
- ✅ Smart Contracts creados
- ✅ Backend API funcional
- ✅ Frontend con UI completa
- ⚠️ Integración real con contratos (preparado, falta deploy)

## 📝 Notas

- Todos los datos son mock para desarrollo
- Los contratos están listos para deploy
- La integración con Soroban RPC está preparada
- Solo falta configurar los Contract IDs después del deploy

