const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { MongoClient } = require('mongodb');
require('dotenv').config();

class WalletTracker {
    constructor() {
        this.connection = new Connection(process.env.SOLANA_RPC_URL, {
            commitment: 'confirmed'
        });
        this.mongoClient = new MongoClient(process.env.MONGO_URI);
    }

    async connect() {
        await this.mongoClient.connect();
        const db = this.mongoClient.db(process.env.DB_NAME);
        this.wallets = db.collection('wallets');
        this.transactions = db.collection('transactions');
    }

    async trackWallet(address) {
        console.log(`\nProcessing wallet: ${address}`);
        const publicKey = new PublicKey(address);

        try {
            const [accountInfo, signatures] = await Promise.all([
                this.connection.getAccountInfo(publicKey),
                this.connection.getSignaturesForAddress(publicKey, { limit: 5 }) // Updated method
            ]);

            const balance = accountInfo ? accountInfo.lamports / LAMPORTS_PER_SOL : 0;
            const recentTransactions = signatures.map(tx => ({
                signature: tx.signature,
                blockTime: tx.blockTime,
                slot: tx.slot
            }));

            await this.wallets.updateOne(
                { address },
                { $set: { balance, lastUpdated: new Date() } },
                { upsert: true }
            );

            console.log(`Balance: ${balance} SOL`);
            return { balance, transactions: recentTransactions.length };
        } catch (error) {
            console.error(`Failed to process wallet ${address}:`, error.message);
            throw error;
        }
    }

    async close() {
        await this.mongoClient.close();
    }
}

module.exports = WalletTracker;
