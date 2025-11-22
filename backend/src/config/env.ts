/**
 * Validación de variables de entorno
 */

import { z } from 'zod';

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001').transform(Number),
  
  // Soroban
  SOROBAN_RPC_URL: z.string().url().default('https://soroban-testnet.stellar.org:443'),
  NETWORK_PASSPHRASE: z.string().default('Test SDF Network ; September 2015'),
  
  // Contract IDs (opcionales hasta deploy)
  STUDY_REGISTRY_CONTRACT_ID: z.string().optional(),
  BIOCREDIT_TOKEN_CONTRACT_ID: z.string().optional(),
  PAYMENT_CONTRACT_ID: z.string().optional(),
  TREASURY_WALLET_ADDRESS: z.string().optional(),
  
  // Backend URL
  NEXT_PUBLIC_BACKEND_URL: z.string().url().default('http://localhost:3001'),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Error en variables de entorno:');
    error.errors.forEach((err) => {
      console.error(`   - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export { env };

