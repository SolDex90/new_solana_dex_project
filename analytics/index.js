const WalletTracker = require('./walletTracker');

async function main() {
    const tracker = new WalletTracker();

    try {
        console.log('Connecting to databases...');
        await tracker.connect();
        console.log('MongoDB Connected ✓');
        console.log('Solana RPC Connected ✓');

        const wallets = ['HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH']; // Example wallet address

        for (const wallet of wallets) {
            console.log('\nTracking wallet:', wallet);

            try {
                console.log('Starting RPC calls...');
                const walletInfo = await tracker.trackWallet(wallet); // Get the returned data
                console.log('RPC calls completed');

                console.log('\nWallet Summary:');
                console.log(`Balance: ${walletInfo.balance} SOL`);
                console.log(`Tokens: ${walletInfo.tokens || 0}`); // Show tokens or 0 if undefined
                console.log(`Transactions: ${walletInfo.transactions || 0}`); // Show transactions or 0 if undefined
            } catch (walletError) {
                console.error(`Failed to process wallet ${wallet}:`, walletError.message);
            }
        }
    } catch (error) {
        console.error('Critical error:', error.message);
    } finally {
        await tracker.close();
    }
}

main();
