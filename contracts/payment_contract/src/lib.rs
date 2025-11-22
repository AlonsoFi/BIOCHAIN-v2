#![no_std]
use soroban_sdk::{
    contract, contractimpl, symbol_short, vec, Address, Env, Symbol, Vec, I128, IntoVal,
};

const PAYMENT_MADE: Symbol = symbol_short!("PAYMENT");

#[contract]
pub struct PaymentContract;

#[contractimpl]
impl PaymentContract {
    /// Paga a múltiples contribuyentes con USDC
    /// 
    /// # Arguments
    /// * `contributors` - Vector de direcciones de los contribuyentes
    /// * `amounts` - Vector de montos en USDC (en unidades más pequeñas, ej: 5 USDC = 50000000 para 7 decimales)
    /// * `usdc_token` - Dirección del contrato token USDC
    /// * `treasury` - Dirección de la tesorería que envía los pagos
    /// * `report_id` - ID del reporte que generó estos pagos
    /// 
    /// # Returns
    /// Emite eventos PaymentMade para cada pago exitoso
    pub fn pay_contributors(
        env: Env,
        contributors: Vec<Address>,
        amounts: Vec<I128>,
        usdc_token: Address,
        treasury: Address,
        report_id: Symbol,
    ) {
        // Validar que los vectores tengan la misma longitud
        if contributors.len() != amounts.len() {
            panic!("contributors and amounts must have the same length");
        }

        // Iterar sobre cada contribuyente y monto
        for i in 0..contributors.len() {
            let contributor = contributors.get(i).unwrap();
            let amount = amounts.get(i).unwrap();

            // Validar que el monto sea positivo
            if amount <= I128::from(0) {
                continue; // Saltar pagos con monto 0 o negativo
            }

            // Transferir USDC desde la tesorería al contribuyente
            // Usamos el contrato token estándar de Soroban
            let transfer_symbol: Symbol = symbol_short!("transfer");
            let transfer_args = vec![
                &env,
                treasury.into_val(&env),
                contributor.into_val(&env),
                amount.into_val(&env),
            ];

            env.invoke_contract::<()>(
                &usdc_token,
                &transfer_symbol,
                transfer_args,
            );

            // Emitir evento PaymentMade
            env.events().publish(
                (PAYMENT_MADE, report_id.clone()),
                (contributor.clone(), amount),
            );
        }
    }

    /// Obtiene el balance de USDC de una dirección
    /// 
    /// # Arguments
    /// * `usdc_token` - Dirección del contrato token USDC
    /// * `address` - Dirección a consultar
    /// 
    /// # Returns
    /// Balance de USDC de la dirección
    pub fn get_balance(env: Env, usdc_token: Address, address: Address) -> I128 {
        let balance_symbol: Symbol = symbol_short!("balance");
        let balance_args = vec![&env, address.into_val(&env)];

        env.invoke_contract::<I128>(
            &usdc_token,
            &balance_symbol,
            balance_args,
        )
    }
}

#[cfg(test)]
mod test;

