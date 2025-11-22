#![cfg(test)]

use super::{BioCreditToken, BioCreditTokenClient};
use soroban_sdk::{
    testutils::{Address as _, Ledger, LedgerInfo},
    Address, Env, I128,
};

#[test]
fn test_mint() {
    let env = Env::default();
    env.mock_all_auths();
    
    env.ledger().set(LedgerInfo {
        timestamp: 12345,
        protocol_version: 20,
        sequence_number: 10,
        network_id: Default::default(),
        base_reserve: 10,
    });

    let contract_id = env.register_contract(None, BioCreditToken);
    let client = BioCreditTokenClient::new(&env, &contract_id);

    let to = Address::generate(&env);
    let amount = I128::from(10);

    let balance = client.mint(&to, &amount);
    assert_eq!(balance, amount);
}

#[test]
fn test_balance() {
    let env = Env::default();
    env.mock_all_auths();
    
    env.ledger().set(LedgerInfo {
        timestamp: 12345,
        protocol_version: 20,
        sequence_number: 10,
        network_id: Default::default(),
        base_reserve: 10,
    });

    let contract_id = env.register_contract(None, BioCreditToken);
    let client = BioCreditTokenClient::new(&env, &contract_id);

    let address = Address::generate(&env);
    
    // Balance inicial debe ser 0
    let balance = client.balance(&address);
    assert_eq!(balance, I128::from(0));

    // Mint y verificar balance
    client.mint(&address, &I128::from(5));
    let balance = client.balance(&address);
    assert_eq!(balance, I128::from(5));
}

#[test]
fn test_transfer() {
    let env = Env::default();
    env.mock_all_auths();
    
    env.ledger().set(LedgerInfo {
        timestamp: 12345,
        protocol_version: 20,
        sequence_number: 10,
        network_id: Default::default(),
        base_reserve: 10,
    });

    let contract_id = env.register_contract(None, BioCreditToken);
    let client = BioCreditTokenClient::new(&env, &contract_id);

    let from = Address::generate(&env);
    let to = Address::generate(&env);

    // Mint a from
    client.mint(&from, &I128::from(10));

    // Transferir
    let new_balance = client.transfer(&from, &to, &I128::from(5));

    // Verificar balances
    assert_eq!(new_balance, I128::from(5));
    assert_eq!(client.balance(&to), I128::from(5));
}

