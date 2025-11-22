#![no_std]
use soroban_sdk::{
    contract, contractimpl, symbol_short, vec, Address, BytesN, Env, Map, Symbol, Vec, u64,
};

const STUDY_REGISTERED: Symbol = symbol_short!("STUDY_REG");

// Estructura de datos para un estudio
#[derive(Clone)]
pub struct StudyData {
    pub study_hash: BytesN<32>,
    pub owner: Address,
    pub timestamp: u64,
    pub lab_identifier: Symbol,
    pub attestation_hash: BytesN<32>,
}

#[contract]
pub struct StudyRegistry;

#[contractimpl]
impl StudyRegistry {
    /// Registra un nuevo estudio en el ledger inmutable
    /// 
    /// # Arguments
    /// * `study_hash` - Hash único del estudio
    /// * `owner_wallet` - Dirección de la wallet del contribuyente
    /// * `timestamp` - Timestamp de cuando se registró el estudio
    /// * `lab_identifier` - Identificador del laboratorio
    /// * `attestation_hash` - Hash de attestation del estudio
    /// 
    /// # Returns
    /// Emite evento STUDY_REGISTERED con los datos del estudio
    pub fn register_study(
        env: Env,
        study_hash: BytesN<32>,
        owner_wallet: Address,
        timestamp: u64,
        lab_identifier: Symbol,
        attestation_hash: BytesN<32>,
    ) {
        // Verificar que el estudio no esté duplicado
        let key = study_hash.clone();
        if env.storage().instance().has(&key) {
            panic!("Study hash already exists");
        }

        // Guardar datos del estudio en el storage
        let study_data = StudyData {
            study_hash: study_hash.clone(),
            owner: owner_wallet.clone(),
            timestamp,
            lab_identifier: lab_identifier.clone(),
            attestation_hash: attestation_hash.clone(),
        };

        // Almacenar estudio por hash
        env.storage().instance().set(&study_hash, &study_data);

        // Almacenar hash en la lista de estudios del owner
        let owner_key = symbol_short!("owner");
        let owner_studies_key = (owner_key, owner_wallet.clone());
        
        let mut owner_studies: Vec<BytesN<32>> = if env.storage().instance().has(&owner_studies_key) {
            env.storage().instance().get(&owner_studies_key).unwrap()
        } else {
            vec![&env]
        };
        
        owner_studies.push_back(study_hash.clone());
        env.storage().instance().set(&owner_studies_key, &owner_studies);

        // Emitir evento
        env.events().publish(
            (STUDY_REGISTERED, study_hash.clone()),
            (
                owner_wallet.clone(),
                timestamp,
                lab_identifier.clone(),
                attestation_hash.clone(),
            ),
        );
    }

    /// Obtiene todos los study_hashes de un owner
    /// 
    /// # Arguments
    /// * `owner` - Dirección del contribuyente
    /// 
    /// # Returns
    /// Vector de study_hashes del owner
    pub fn get_study_hashes_by_owner(env: Env, owner: Address) -> Vec<BytesN<32>> {
        let owner_key = symbol_short!("owner");
        let owner_studies_key = (owner_key, owner);
        
        if env.storage().instance().has(&owner_studies_key) {
            env.storage().instance().get(&owner_studies_key).unwrap()
        } else {
            vec![&env]
        }
    }

    /// Obtiene los datos completos de un estudio por su hash
    /// 
    /// # Arguments
    /// * `study_hash` - Hash del estudio
    /// 
    /// # Returns
    /// Datos del estudio (owner, timestamp, lab_identifier, attestation_hash)
    pub fn get_study_data(env: Env, study_hash: BytesN<32>) -> StudyData {
        if !env.storage().instance().has(&study_hash) {
            panic!("Study not found");
        }
        
        env.storage().instance().get(&study_hash).unwrap()
    }

    /// Obtiene timestamp y lab_identifier de un estudio
    /// 
    /// # Arguments
    /// * `study_hash` - Hash del estudio
    /// 
    /// # Returns
    /// Tupla con (timestamp, lab_identifier)
    pub fn get_study_metadata(env: Env, study_hash: BytesN<32>) -> (u64, Symbol) {
        let study_data = Self::get_study_data(env.clone(), study_hash);
        (study_data.timestamp, study_data.lab_identifier)
    }

    /// Obtiene todos los estudios de un owner con sus metadatos
    /// 
    /// # Arguments
    /// * `owner` - Dirección del contribuyente
    /// 
    /// # Returns
    /// Map con study_hash -> (timestamp, lab_identifier)
    pub fn get_studies_by_owner(env: Env, owner: Address) -> Map<BytesN<32>, (u64, Symbol)> {
        let study_hashes = Self::get_study_hashes_by_owner(env.clone(), owner);
        let mut result = Map::new(&env);
        
        for i in 0..study_hashes.len() {
            let study_hash = study_hashes.get(i).unwrap();
            let (timestamp, lab_identifier) = Self::get_study_metadata(env.clone(), study_hash.clone());
            result.set(study_hash, (timestamp, lab_identifier));
        }
        
        result
    }
}

#[cfg(test)]
mod test;

