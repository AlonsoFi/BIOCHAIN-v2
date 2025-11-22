#![cfg(test)]

use super::{StudyRegistry, StudyRegistryClient};
use soroban_sdk::{
    symbol_short,
    testutils::{Address as _, Ledger, LedgerInfo},
    vec, Address, BytesN, Env, Symbol, u64,
};

#[test]
fn test_register_study() {
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
    let contract_id = env.register_contract(None, StudyRegistry);
    let client = StudyRegistryClient::new(&env, &contract_id);

    // Crear datos de prueba
    let owner = Address::generate(&env);
    let study_hash = BytesN::from_array(&env, &[0u8; 32]);
    let attestation_hash = BytesN::from_array(&env, &[1u8; 32]);
    let lab_identifier = symbol_short!("LAB_001");
    let timestamp = 12345u64;

    // Registrar estudio
    client.register_study(
        &study_hash,
        &owner,
        &timestamp,
        &lab_identifier,
        &attestation_hash,
    );

    // Verificar que se puede obtener
    let study_data = client.get_study_data(&study_hash);
    assert_eq!(study_data.owner, owner);
    assert_eq!(study_data.timestamp, timestamp);
    assert_eq!(study_data.lab_identifier, lab_identifier);
}

#[test]
fn test_get_studies_by_owner() {
    let env = Env::default();
    env.mock_all_auths();
    
    env.ledger().set(LedgerInfo {
        timestamp: 12345,
        protocol_version: 20,
        sequence_number: 10,
        network_id: Default::default(),
        base_reserve: 10,
    });

    let contract_id = env.register_contract(None, StudyRegistry);
    let client = StudyRegistryClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let lab_identifier = symbol_short!("LAB_001");

    // Registrar múltiples estudios
    for i in 0..3 {
        let mut hash_bytes = [0u8; 32];
        hash_bytes[0] = i as u8;
        let study_hash = BytesN::from_array(&env, &hash_bytes);
        let attestation_hash = BytesN::from_array(&env, &[1u8; 32]);
        let timestamp = (12345 + i * 1000) as u64;

        client.register_study(
            &study_hash,
            &owner,
            &timestamp,
            &lab_identifier,
            &attestation_hash,
        );
    }

    // Obtener estudios del owner
    let studies = client.get_studies_by_owner(&owner);
    assert_eq!(studies.len(), 3);
}

