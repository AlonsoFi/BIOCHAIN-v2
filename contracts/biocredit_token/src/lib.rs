#![no_std]
use soroban_sdk::{
    contract, contractimpl, symbol_short, Address, Env, I128, IntoVal,
};

const BALANCE: symbol_short = symbol_short!("BALANCE");

#[contract]
pub struct BioCreditToken;

#[contractimpl]
impl BioCreditToken {
    /// Mint BioCredits a una dirección
    /// 
    /// # Arguments
    /// * `to` - Dirección que recibirá los BioCredits
    /// * `amount` - Cantidad de BioCredits a mintear
    /// 
    /// # Returns
    /// Nueva cantidad total de BioCredits de la dirección
    pub fn mint(env: Env, to: Address, amount: I128) -> I128 {
        let balance_key = (BALANCE, to.clone());
        let current_balance: I128 = if env.storage().instance().has(&balance_key) {
            env.storage().instance().get(&balance_key).unwrap()
        } else {
            I128::from(0)
        };

        let new_balance = current_balance + amount;
        env.storage().instance().set(&balance_key, &new_balance);

        new_balance
    }

    /// Obtiene el balance de BioCredits de una dirección
    /// 
    /// # Arguments
    /// * `address` - Dirección a consultar
    /// 
    /// # Returns
    /// Balance de BioCredits
    pub fn balance(env: Env, address: Address) -> I128 {
        let balance_key = (BALANCE, address);
        if env.storage().instance().has(&balance_key) {
            env.storage().instance().get(&balance_key).unwrap()
        } else {
            I128::from(0)
        }
    }

    /// Transfiere BioCredits de una dirección a otra
    /// 
    /// # Arguments
    /// * `from` - Dirección que envía
    /// * `to` - Dirección que recibe
    /// * `amount` - Cantidad a transferir
    /// 
    /// # Returns
    /// Balance actualizado del remitente
    pub fn transfer(env: Env, from: Address, to: Address, amount: I128) -> I128 {
        // Verificar que el remitente tenga suficiente balance
        let from_balance = Self::balance(env.clone(), from.clone());
        if from_balance < amount {
            panic!("Insufficient balance");
        }

        // Restar del remitente
        let from_balance_key = (BALANCE, from.clone());
        let new_from_balance = from_balance - amount;
        env.storage().instance().set(&from_balance_key, &new_from_balance);

        // Sumar al destinatario
        let to_balance = Self::balance(env.clone(), to.clone());
        let to_balance_key = (BALANCE, to);
        let new_to_balance = to_balance + amount;
        env.storage().instance().set(&to_balance_key, &new_to_balance);

        new_from_balance
    }
}

#[cfg(test)]
mod test;

