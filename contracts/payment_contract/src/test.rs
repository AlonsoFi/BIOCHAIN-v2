#![cfg(test)]

use super::{PaymentContract, PaymentContractClient};
use soroban_sdk::{
    symbol_short,
    testutils::{Address as _, Ledger, LedgerInfo},
    vec, Address, Env, I128, Symbol,
};

#[test]
fn test_pay_contributors() {
    let env = Env::default();
    env.mock_all_auths();
    
    // Configurar el ledger
    env.ledger().set(LedgerInfo {
        timestamp: 12345,
        protocol_version: 20,
        sequence_number: 10,
        network_id: Default::default(),
        base_reserve: 10,
    });

    // Crear el contrato
    let contract_id = env.register_contract(None, PaymentContract);
    let client = PaymentContractClient::new(&env, &contract_id);

    // Crear direcciones de prueba
    let treasury = Address::generate(&env);
    let contributor1 = Address::generate(&env);
    let contributor2 = Address::generate(&env);

    // Crear un token USDC mock (en tests reales usarías el contrato token real)
    let usdc_token = Address::generate(&env);

    // Preparar datos de prueba
    let contributors = vec![&env, contributor1.clone(), contributor2.clone()];
    let amounts = vec![&env, I128::from(5000000), I128::from(5000000)]; // 5 USDC cada uno
    let report_id = symbol_short!("REPORT_001");

    // Ejecutar la función (en un test real necesitarías configurar el token primero)
    // client.pay_contributors(&contributors, &amounts, &usdc_token, &treasury, &report_id);

    // Verificar eventos (en un test real verificarías los eventos emitidos)
    // let events = env.events().all();
    // assert!(events.len() > 0);
}

