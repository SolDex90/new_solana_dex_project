import { Connection, clusterApiUrl } from '@solana/web3.js';

const network = process.env.REACT_APP_SOLANA_NETWORK || 'devnet';
const rpcUrl = process.env.REACT_APP_SOLANA_RPC_URL || clusterApiUrl(network);

export const connection = new Connection(rpcUrl, 'confirmed');
