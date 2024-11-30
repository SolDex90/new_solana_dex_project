const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testMongoConnection() {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        console.log('Connecting to MongoDB Atlas...');
        await client.connect();
        console.log('Connected to MongoDB Atlas successfully!');

        const db = client.db(dbName);
        console.log(`Using database: ${db.databaseName}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    } finally {
        await client.close();
    }
}

testMongoConnection();
