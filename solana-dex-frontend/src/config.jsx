import { Connection, clusterApiUrl } from '@solana/web3.js';

const network = import.meta.env.VITE_APP_SOLANA_NETWORK || 'devnet';
const rpcUrl = import.meta.env.VITE_APP_RPC_END_POINT || clusterApiUrl(network);
export const CRYPTO_COMPARE = import.meta.env.VITE_CRYPTO_COMPARE_API_KEY;

export const connection = new Connection(rpcUrl, 'confirmed');
export const PROGRAM_ID = "BTNaNtGC5sTfNUbusLBRuMViPT2wNBvkzCem5HEDBUMM";

export const VAULT_SEED = "VAULT_SEED";
export const TOKEN_VAULT_SEED = "TOKEN_VAULT_SEED";
export const PRESALE_SEED = "PRESALE_SEED";
export const USER_INFO_SEED = "USER_INFO_SEED";

export const tokenMintAddress = "CxnjwHeSky653wBHgzCJc8Ts7dfH2QrGXEXEitbMiNYC";
