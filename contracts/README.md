# BioChain Smart Contracts (Soroban)

Contratos inteligentes para el sistema de pagos de BioChain.

## 📋 Contratos

### PaymentContract

Contrato para realizar pagos en USDC a contribuyentes cuando sus análisis son utilizados en reportes.

**Funciones principales:**
- `pay_contributors()` - Paga a múltiples contribuyentes con USDC
- `get_balance()` - Consulta el balance de USDC de una dirección

### StudyRegistry

Contrato para registrar y consultar estudios en el ledger inmutable de Soroban.

**Funciones principales:**
- `register_study()` - Registra un nuevo estudio con sus metadatos
- `get_study_hashes_by_owner()` - Obtiene todos los study_hashes de un contribuyente
- `get_study_metadata()` - Obtiene timestamp y lab_identifier de un estudio
- `get_studies_by_owner()` - Obtiene todos los estudios de un owner con sus metadatos

## 🛠️ Prerrequisitos

1. **Instalar Stellar CLI (Stellar Core)**
   ```bash
   # macOS
   brew install stellar/stellar/stellar-core
   
   # Linux
   # Descargar desde: https://github.com/stellar/stellar-core/releases
   ```

2. **Instalar Soroban CLI**
   ```bash
   curl -sSL https://soroban.stellar.org | sh
   # O usando cargo
   cargo install --locked soroban-cli
   ```

3. **Instalar Rust y Cargo**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source $HOME/.cargo/env
   ```

4. **Verificar instalación**
   ```bash
   soroban --version
   rustc --version
   cargo --version
   ```

## 🚀 Desarrollo Local

### 1. Configurar el entorno

```bash
# Navegar a la carpeta de contratos
cd contracts

# Configurar red de prueba (testnet)
soroban config network add testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# Configurar red local (para desarrollo)
soroban config network add local \
  --rpc-url http://localhost:8000/soroban/rpc \
  --network-passphrase "Standalone Network ; February 2017"

# Verificar configuración
soroban config network ls
```

### 2. Compilar los contratos

```bash
# Compilar el contrato
soroban contract build

# O usando cargo directamente
cargo build --target wasm32-unknown-unknown --release
```

### 3. Ejecutar tests

```bash
# Ejecutar tests del contrato
cargo test

# O usando soroban
soroban contract test
```

## 📦 Deploy a Testnet

### Paso 1: Obtener cuenta de prueba

```bash
# Generar una nueva cuenta
soroban keys generate <nombre-cuenta>

# Obtener la clave pública
soroban keys show <nombre-cuenta>

# Fondear la cuenta en testnet
# Visita: https://laboratory.stellar.org/#account-creator?network=testnet
# Ingresa tu clave pública para recibir fondos de prueba
```

### Paso 2: Compilar los contratos

```bash
# Desde la raíz del proyecto
cd contracts

# Compilar todos los contratos
soroban contract build

# O compilar un contrato específico
cd payment_contract
cargo build --target wasm32-unknown-unknown --release

cd ../study_registry
cargo build --target wasm32-unknown-unknown --release
```

### Paso 3: Deploy de PaymentContract

```bash
# Asegúrate de estar en la carpeta del contrato
cd contracts/payment_contract

# Deploy a testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/payment_contract.wasm \
  --source <nombre-cuenta> \
  --network testnet

# Guarda el Contract ID que se muestra (ejemplo: CA3D5KRYM6CB7OWQ6TWYRR3Z4TQGN3K4B6XN5X3Y6E2M7B6Z5Z5Z5Z5)
# Lo necesitarás para invocar funciones del contrato
export PAYMENT_CONTRACT_ID="<CONTRACT_ID_AQUI>"
```

### Paso 4: Deploy de StudyRegistry

```bash
# Asegúrate de estar en la carpeta del contrato
cd contracts/study_registry

# Deploy a testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/study_registry.wasm \
  --source <nombre-cuenta> \
  --network testnet

# Guarda el Contract ID
export STUDY_REGISTRY_CONTRACT_ID="<CONTRACT_ID_AQUI>"
```

### Paso 5: Registrar un estudio en StudyRegistry

```bash
# Ejemplo: Registrar un estudio
soroban contract invoke \
  --id $STUDY_REGISTRY_CONTRACT_ID \
  --source <nombre-cuenta> \
  --network testnet \
  -- \
  register_study \
  --study_hash <STUDY_HASH> \
  --owner_wallet <OWNER_ADDRESS> \
  --timestamp <TIMESTAMP> \
  --lab_identifier "LAB_001" \
  --attestation_hash <ATTESTATION_HASH>
```

### Paso 6: Consultar estudios de un owner

```bash
# Obtener todos los estudios de un contribuyente
soroban contract invoke \
  --id $STUDY_REGISTRY_CONTRACT_ID \
  --source <nombre-cuenta> \
  --network testnet \
  -- \
  get_studies_by_owner \
  --owner <OWNER_ADDRESS>
```

### Paso 7: Obtener Token USDC en Testnet

Para usar el contrato necesitas la dirección del token USDC. En testnet puedes usar un token de prueba:

```bash
# Opción 1: Usar el token USDC de prueba de Stellar
# Dirección del token USDC en testnet (ejemplo - verifica la dirección actual):
# CDLZFC3SYJY0NX2MAV8VVWY32PXV3Z2B6X2LE5J5XY6AC57J2Z4Z4Z4Z4

# Opción 2: Crear tu propio token de prueba
# Usa el contrato token estándar de Soroban para crear un token de prueba
```

### Paso 5: Probar el contrato

```bash
# Ejemplo: Consultar balance (requiere que la dirección tenga USDC)
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source <nombre-cuenta> \
  --network testnet \
  -- \
  get_balance \
  --usdc_token <USDC_TOKEN_ADDRESS> \
  --address <ADDRESS_TO_CHECK>
```

## 🌐 Deploy a Mainnet

⚠️ **ADVERTENCIA**: Solo deploya a mainnet después de pruebas exhaustivas en testnet.

```bash
# Configurar red mainnet
soroban config network add mainnet \
  --rpc-url https://soroban-mainnet.stellar.org:443 \
  --network-passphrase "Public Global Stellar Network ; September 2015"

# Asegúrate de tener una cuenta con fondos reales
soroban keys generate <nombre-cuenta-mainnet>
# Fondear con XLM real

# Deploy a mainnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/payment_contract.wasm \
  --source <nombre-cuenta-mainnet> \
  --network mainnet
```

## 🔧 Uso del Contrato

### Invocar pay_contributors

```bash
# Ejemplo: Pagar a 2 contribuyentes con 5 USDC cada uno
# IMPORTANTE: La tesorería debe tener suficiente USDC y haber autorizado al contrato

# Primero, autorizar al contrato para transferir desde la tesorería
# (Esto se hace desde el contrato token USDC)

# Luego, invocar pay_contributors
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source <nombre-cuenta> \
  --network testnet \
  -- \
  pay_contributors \
  --contributors '[<ADDRESS_1>,<ADDRESS_2>]' \
  --amounts '[50000000,50000000]' \
  --usdc_token <USDC_TOKEN_ADDRESS> \
  --treasury <TREASURY_ADDRESS> \
  --report_id "REPORT_001"
```

**Nota importante sobre montos**: Los montos están en la unidad más pequeña del token. Para USDC (7 decimales):
- 1 USDC = 10,000,000 unidades
- 5 USDC = 50,000,000 unidades

**Nota sobre autorización**: Antes de invocar `pay_contributors`, la tesorería debe autorizar al contrato para transferir USDC. Esto se hace invocando `approve` en el contrato token USDC.

### Consultar balance

```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source <nombre-cuenta> \
  --network testnet \
  -- \
  get_balance \
  --usdc_token <USDC_TOKEN_ADDRESS> \
  --address <ADDRESS_TO_CHECK>

# El resultado será en unidades más pequeñas (ej: 50000000 = 5 USDC)
```

### Ver eventos emitidos

```bash
# Ver eventos de pagos realizados
soroban contract events \
  --id <CONTRACT_ID> \
  --network testnet \
  --start-ledger <LEDGER_NUMBER>
```

## 📝 Variables de Entorno

Crea un archivo `.env` en la carpeta `contracts/`:

```env
# Cuenta para deploy
DEPLOYER_SECRET_KEY=your_secret_key_here

# Network
NETWORK=testnet

# Contract IDs (después del deploy)
PAYMENT_CONTRACT_ID=contract_id_here

# Token USDC
USDC_TOKEN_ADDRESS=usdc_token_address_here

# Treasury Address
TREASURY_ADDRESS=treasury_address_here
```

## 🧪 Testing

### Tests unitarios

```bash
cargo test
```

### Tests de integración

```bash
# Ejecutar tests con Soroban CLI
soroban contract test
```

## 📚 Estructura del Proyecto

```
contracts/
├── Cargo.toml              # Configuración del workspace
├── payment_contract/
│   ├── Cargo.toml          # Configuración del contrato
│   └── src/
│       ├── lib.rs          # Código principal del contrato
│       └── test.rs         # Tests del contrato
└── README.md               # Este archivo
```

## 🔐 Seguridad

- ✅ El contrato valida que los vectores tengan la misma longitud
- ✅ Valida que los montos sean positivos
- ✅ Solo la tesorería autorizada puede realizar pagos
- ✅ Emite eventos para auditoría

## 📖 Documentación Adicional

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Soroban SDK Reference](https://docs.rs/soroban-sdk/)
- [Stellar Laboratory](https://laboratory.stellar.org/)

## 🐛 Troubleshooting

### Error: "Account not found"
- Asegúrate de que la cuenta esté fondeada con XLM
- Verifica que estés usando la red correcta

### Error: "Contract not found"
- Verifica que el Contract ID sea correcto
- Asegúrate de haber deployado el contrato en la red correcta

### Error de compilación
- Verifica que tengas Rust instalado correctamente
- Ejecuta `rustup update`
- Limpia el build: `cargo clean && cargo build`

## 📞 Soporte

Para problemas o preguntas, consulta la documentación oficial de Soroban o abre un issue en el repositorio.

