const { Connection, PublicKey } = require('@solana/web3.js');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const connection = new Connection(process.env.SOLANA_RPC_URL);
const mongoClient = new MongoClient(process.env.MONGO_URI);
const dbName = process.env.DB_NAME;

async function fetchWallets() {
    try {
        await mongoClient.connect();
        console.log("Connected to MongoDB");
        const db = mongoClient.db(dbName);
        const walletsCollection = db.collection("wallets");

        await walletsCollection.createIndex({ pubkey: 1 }, { unique: true });

        const accounts = await connection.getProgramAccounts(
            new PublicKey("11111111111111111111111111111111"), // Example: System Program
            {
                filters: [{ dataSize: 0 }],
                dataSlice: { offset: 0, length: 0 }
            }
        );

        const walletData = accounts.map(account => ({
            pubkey: account.pubkey.toString(),
            lamports: account.account.lamports,
            owner: account.account.owner.toString(),
            lastUpdated: new Date()
        }));

        const operations = walletData.map(wallet => ({
            updateOne: {
                filter: { pubkey: wallet.pubkey },
                update: { $set: wallet },
                upsert: true
            }
        }));

        await walletsCollection.bulkWrite(operations);
        console.log(`Processed ${walletData.length} wallets`);
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoClient.close();
    }
}

fetchWallets();
