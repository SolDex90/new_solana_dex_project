const {MongoClient} = require('mongodb');

const uri = process.env.MONGO_CONNECTION_STRING;

let client, database;

async function connectToDB(){
    if(!client){
        client = new MongoClient(uri);
        database = client.db('solana_dex');
        await client.connect();
        console.log('DB connected');
    }
    return {client,database};
}

module.exports = {connectToDB};