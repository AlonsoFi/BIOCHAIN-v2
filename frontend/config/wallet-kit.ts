import {
  StellarWalletsKit,
  WalletNetwork,
  FREIGHTER_ID,
  AlbedoModule,
  FreighterModule,
} from "@creit.tech/stellar-wallets-kit";

/**
 * Main configuration for Stellar Wallet Kit
 * This kit supports multiple wallet types including Freighter and Albedo
 * Configure for TESTNET during development and MAINNET for production
 */
export const kit: StellarWalletsKit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: [new FreighterModule(), new AlbedoModule()],
});

/**
 * Interface for transaction signing parameters
 */
interface signTransactionProps {
  unsignedTransaction: string;
  address: string;
}

/**
 * Sign a Stellar transaction using the connected wallet
 * This function handles the signing process and returns the signed transaction
 *
 * @param unsignedTransaction - The XDR string of the unsigned transaction
 * @param address - The wallet address that will sign the transaction
 * @returns Promise<string> - The signed transaction XDR
 */
export const signTransaction = async ({
  unsignedTransaction,
  address,
}: signTransactionProps): Promise<string> => {
  const { signedTxXdr } = await kit.signTransaction(unsignedTransaction, {
    address,
    networkPassphrase: WalletNetwork.TESTNET,
  });

  return signedTxXdr;
};
