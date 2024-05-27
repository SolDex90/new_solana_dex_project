import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import { assert } from "chai";

// Define the types for MyAccount and CustomTokenAccount
interface MyAccount {
  data: anchor.BN;
}

interface CustomTokenAccount {
  amount: anchor.BN;
}

// Use local Solana RPC URL
const connection = new Connection('http://127.0.0.1:8899');

describe('my_dex_project', function () {
  this.timeout(60000); // Increase timeout to 60 seconds

  const provider = new anchor.AnchorProvider(connection, anchor.AnchorProvider.local().wallet, {});
  anchor.setProvider(provider);

  const program = anchor.workspace.MyDexProject as Program<any>;

  let dataAccount: anchor.web3.Keypair;
  let tokenAccount: anchor.web3.Keypair;

  before(async function () {
    try {
      console.log("Generating keypairs...");
      dataAccount = anchor.web3.Keypair.generate();
      tokenAccount = anchor.web3.Keypair.generate();
      console.log("Data Account Public Key:", dataAccount.publicKey.toString());
      console.log("Token Account Public Key:", tokenAccount.publicKey.toString());

      console.log("Requesting airdrop...");
      const airdropSignature = await provider.connection.requestAirdrop(provider.wallet.publicKey, anchor.web3.LAMPORTS_PER_SOL);
      await provider.connection.confirmTransaction(airdropSignature);
      console.log("Airdrop completed");

      const lamports = await provider.connection.getMinimumBalanceForRentExemption(8 + 8);
      console.log("Minimum balance for rent exemption: ", lamports);

      console.log("Creating data account...");
      const createDataAccountTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: dataAccount.publicKey,
          lamports,
          space: 8 + 8,
          programId: program.programId,
        })
      );

      const { blockhash } = await provider.connection.getRecentBlockhash();
      createDataAccountTx.recentBlockhash = blockhash;
      createDataAccountTx.feePayer = provider.wallet.publicKey;

      createDataAccountTx.partialSign(dataAccount);
      await provider.wallet.signTransaction(createDataAccountTx);

      const createSignature = await provider.sendAndConfirm(createDataAccountTx, [dataAccount]);
      console.log("Create account transaction signature:", createSignature);

      console.log("Data account created");

      console.log("Creating token account...");
      const createTokenAccountTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: tokenAccount.publicKey,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(8 + 8),
          space: 8 + 8,
          programId: program.programId,
        })
      );

      createTokenAccountTx.recentBlockhash = (await provider.connection.getRecentBlockhash()).blockhash;
      createTokenAccountTx.feePayer = provider.wallet.publicKey;

      createTokenAccountTx.partialSign(tokenAccount);
      await provider.wallet.signTransaction(createTokenAccountTx);

      const tokenSignature = await provider.sendAndConfirm(createTokenAccountTx, [tokenAccount]);
      console.log("Token account transaction signature:", tokenSignature);

      console.log("Token account created");
    } catch (error) {
      console.error("Error during setup: ", error);
      throw error;
    }
  });

  it('Initializes an account', async () => {
    try {
      const { blockhash } = await provider.connection.getRecentBlockhash();
      let tx = await program.methods.initialize(new anchor.BN(0)).accounts({
        myAccount: dataAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }).transaction();

      // Set the recent blockhash and fee payer
      tx.recentBlockhash = blockhash;
      tx.feePayer = provider.wallet.publicKey;

      // Sign the transaction
      tx.partialSign(dataAccount);
      await provider.wallet.signTransaction(tx);

      // Serialize the transaction to calculate its size
      const serializedTx = tx.serialize();
      const txSize = serializedTx.length;
      console.log(`Serialized transaction size: ${txSize} bytes`);

      const signature = await provider.sendAndConfirm(tx, [dataAccount]);
      console.log("Transaction signature:", signature);
    } catch (err) {
      console.error("Transaction failed:", err);
      if (err.logs) {
        console.error("Transaction logs:", err.logs);
      }
      return;
    }

    // Fetch and print the account data to confirm initialization
    try {
      const account = await program.account.myAccount.fetch(dataAccount.publicKey) as MyAccount;
      console.log("Fetched account data:", account);

      // Verify the account data
      if (account && account.data.eq(new anchor.BN(0))) { // Correctly access 'data' field
        console.log("Account is initialized correctly.");
      } else {
        console.error("Account initialization failed.");
      }
    } catch (fetchErr) {
      console.error("Failed to fetch account data:", fetchErr);
    }
  });

  it('Transfers tokens', async () => {
    try {
      const { blockhash } = await provider.connection.getRecentBlockhash();
      let tx = await program.methods.transfer(new anchor.BN(1)).accounts({
        from: tokenAccount.publicKey,
        to: tokenAccount.publicKey,
        authority: provider.wallet.publicKey,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
      }).transaction();

      tx.recentBlockhash = blockhash;
      tx.feePayer = provider.wallet.publicKey;

      // Ensure that the correct signers are added
      tx.partialSign(tokenAccount);
      await provider.wallet.signTransaction(tx);

      const signature = await provider.sendAndConfirm(tx, [tokenAccount]);
      console.log("Transaction signature:", signature);

      const account = await program.account.customTokenAccount.fetch(tokenAccount.publicKey) as CustomTokenAccount;
      assert.ok(account.amount.eq(new anchor.BN(1))); // Correctly access 'amount' field
    } catch (err) {
      console.error("Failed to transfer tokens:", err);
      if (err.logs) {
        console.error("Transaction logs:", err.logs);
      }
    }
  });
});
