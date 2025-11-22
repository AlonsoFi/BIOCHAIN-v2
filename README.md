# BioChain

Sistema de gestión de historial clínico basado en blockchain Stellar.

## 📋 Descripción

BioChain es una aplicación web que permite a los usuarios gestionar su historial clínico de forma segura, utilizando la tecnología blockchain de Stellar para garantizar la integridad y privacidad de los datos médicos.

## 🏗️ Estructura del Proyecto

```
BIOCHAIN/
├── frontend/          # Aplicación Next.js con React
│   ├── app/          # Páginas y layouts
│   ├── components/   # Componentes React
│   ├── config/       # Configuración de wallet Stellar
│   ├── hooks/        # Custom hooks
│   └── providers/    # Context providers
│
└── backend/          # API Node.js/Express
    ├── src/
    │   ├── routes/   # Endpoints de la API
    │   ├── services/ # Lógica de negocio
    │   └── middleware/ # Middlewares
    └── dist/         # Build de producción
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd BIOCHAIN
```

2. Instalar dependencias del frontend:
```bash
cd frontend
npm install
```

3. Instalar dependencias del backend:
```bash
cd ../backend
npm install
```

### Desarrollo

**Frontend:**
```bash
cd frontend
npm run dev
```
El frontend estará disponible en `http://localhost:3000`

**Backend:**
```bash
cd backend
npm run dev
```
El backend estará disponible en `http://localhost:3001`

## 🛠️ Tecnologías

### Frontend
- **Next.js 16** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **Stellar Wallet Kit** - Integración con wallets Stellar
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **Multer** - Manejo de archivos PDF
- **Crypto** - Generación de hashes

## 📝 Funcionalidades

- ✅ Conexión de wallet Stellar (Freighter, Albedo)
- ✅ Formulario de historial clínico
- ✅ Upload y procesamiento de PDFs
- ✅ Anonimización de datos (PII removal)
- ✅ Extracción de biomarcadores
- ✅ Generación de hashes (study_hash, attestation_hash)
- ✅ Validación de duplicados
- ✅ Integración con Smart Contracts (mock)

## 🔗 Endpoints de la API

### Backend
- `GET /health` - Health check
- `POST /api/clinical-history` - Guardar historial clínico
- `GET /api/clinical-history/:id` - Obtener historial por ID
- `POST /api/pdf/upload` - Subir y procesar PDF

## 📄 Licencia

ISC

## 👥 Contribuidores

- [Tu nombre]

---

**Nota:** Este proyecto está en desarrollo activo. Algunas funcionalidades pueden estar en modo mock/simulación.


