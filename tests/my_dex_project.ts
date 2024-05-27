console.log("Creating account with the following details:");
    console.log("From Pubkey:", provider.wallet.publicKey.toString());
    console.log("New Account Pubkey:", dataAccount.publicKey.toString());
    console.log("Lamports:", lamports);
    console.log("Space:", 8 + 8);
    console.log("Program ID:", program.programId.toString());

    const createTx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: dataAccount.publicKey,
        lamports,
        space: 8 + 8,
        programId: program.programId,
      })
    );

    createTx.recentBlockhash = blockhash;
    createTx.feePayer = provider.wallet.publicKey;

    try {
      await provider.wallet.signTransaction(createTx);
      createTx.partialSign(dataAccount);

      const createSignature = await provider.sendAndConfirm(createTx, [dataAccount]);
      console.log("Create account transaction signature:", createSignature);
    } catch (err) {
      console.error("Failed to create account or send transaction:", err);
      return;
    }

    
 
console.log("Sending initialize instruction");
    try {
      const tx = await program.methods.initialize().accounts({
        data: dataAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([dataAccount]).transaction();

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
      const account = await program.account.data.fetch(dataAccount.publicKey);
      console.log("Account data:", account);

      // Verify the account data
      if (account && account.value === 0) {
        console.log("Account is initialized correctly.");
      } else {
        console.error("Account initialization failed.");
      }
    } catch (fetchErr) {
      console.error("Failed to fetch account data:", fetchErr);
    }
  });
});