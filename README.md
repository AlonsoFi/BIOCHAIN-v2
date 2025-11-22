# BioChain - Plataforma Blockchain para Datos Clínicos

Plataforma blockchain que permite a los contribuyentes subir sus análisis médicos y ganar USDC cuando son utilizados en reportes, mientras que los investigadores pueden generar reportes personalizados con IA usando el dataset global.

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd BIOCHAIN
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Instalar dependencias del frontend**
```bash
cd ../frontend
npm install
```

4. **Configurar variables de entorno**

Backend (`backend/.env`):
```env
NODE_ENV=development
PORT=3001
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org:443
NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

5. **Ejecutar el proyecto**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

6. **Abrir en el navegador**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## 📋 Funcionalidades

### Contribuyente
- ✅ Subir PDFs de estudios médicos
- ✅ Ver dashboard con estudios subidos
- ✅ Recibir pagos USDC cuando sus estudios son usados
- ✅ Ver historial de pagos

### Investigador
- ✅ Comprar BioCredits
- ✅ Generar reportes personalizados con IA
- ✅ Filtrar por laboratorios, biomarcadores, fechas
- ✅ Descargar reportes como PDF
- ✅ Ver historial de reportes generados

## 🏗️ Arquitectura

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Blockchain**: Soroban (Stellar)
- **Smart Contracts**: Rust (Soroban)

## 📁 Estructura

```
BIOCHAIN/
├── backend/          # API Backend
├── frontend/         # Aplicación Next.js
├── contracts/        # Smart Contracts Soroban
└── docs/            # Documentación
```

## 🔐 Seguridad

- ✅ Validación de inputs con Zod
- ✅ Rate limiting
- ✅ Validación de Stellar addresses
- ✅ Error handling robusto
- ✅ Logging estructurado

## 📝 Documentación

Ver `ESTADO_ACTUAL.md` para detalles completos del estado del proyecto.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

ISC

---

**Estado:** MVP Funcional - Listo para deploy de contratos
