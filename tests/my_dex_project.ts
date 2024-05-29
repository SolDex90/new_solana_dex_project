import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import * as splToken from "@solana/spl-token"; // Make sure to import spl-token
import { assert } from "chai";

// Define the types for MyAccount, CustomTokenAccount, Market, Order, LiquidityPool, and StakingAccount
interface MyAccount {
  data: anchor.BN;
}

interface CustomTokenAccount {
  amount: anchor.BN;
}

interface Market {
  orders: Order[];
}

interface Order {
  order_type: OrderType;
  amount: anchor.BN;
  price: anchor.BN;
}

interface LiquidityPool {
  total_liquidity: anchor.BN;
  reserves: anchor.BN;
}

interface StakingAccount {
  amount: anchor.BN;
  rewards_claimed: anchor.BN;
}

enum OrderType {
  Buy,
  Sell,
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
  let marketAccount: anchor.web3.Keypair;
  let poolAccount: anchor.web3.Keypair;
  let stakingAccount: anchor.web3.Keypair;
  let proposalAccount: anchor.web3.Keypair;

  before(async function () {
    try {
      console.log("Generating keypairs...");
      dataAccount = anchor.web3.Keypair.generate();
      tokenAccount = anchor.web3.Keypair.generate();
      marketAccount = anchor.web3.Keypair.generate();
      poolAccount = anchor.web3.Keypair.generate();
      stakingAccount = anchor.web3.Keypair.generate();
      proposalAccount = anchor.web3.Keypair.generate();

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

      console.log("Creating market account...");
      const createMarketAccountTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: marketAccount.publicKey,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(8 + 8 * 10), // Adjust space as needed
          space: 8 + 8 * 10, // Adjust space as needed
          programId: program.programId,
        })
      );

      createMarketAccountTx.recentBlockhash = (await provider.connection.getRecentBlockhash()).blockhash;
      createMarketAccountTx.feePayer = provider.wallet.publicKey;

      createMarketAccountTx.partialSign(marketAccount);
      await provider.wallet.signTransaction(createMarketAccountTx);

      const marketSignature = await provider.sendAndConfirm(createMarketAccountTx, [marketAccount]);
      console.log("Market account transaction signature:", marketSignature);

      console.log("Creating liquidity pool account...");
      const createPoolAccountTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: poolAccount.publicKey,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(8 + 64),
          space: 8 + 64,
          programId: program.programId,
        })
      );

      createPoolAccountTx.recentBlockhash = (await provider.connection.getRecentBlockhash()).blockhash;
      createPoolAccountTx.feePayer = provider.wallet.publicKey;

      createPoolAccountTx.partialSign(poolAccount);
      await provider.wallet.signTransaction(createPoolAccountTx);

      const poolSignature = await provider.sendAndConfirm(createPoolAccountTx, [poolAccount]);
      console.log("Liquidity pool account transaction signature:", poolSignature);

      console.log("Creating staking account...");
      const createStakingAccountTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: stakingAccount.publicKey,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(8 + 64),
          space: 8 + 64,
          programId: program.programId,
        })
      );

      createStakingAccountTx.recentBlockhash = (await provider.connection.getRecentBlockhash()).blockhash;
      createStakingAccountTx.feePayer = provider.wallet.publicKey;

      createStakingAccountTx.partialSign(stakingAccount);
      await provider.wallet.signTransaction(createStakingAccountTx);

      const stakingSignature = await provider.sendAndConfirm(createStakingAccountTx, [stakingAccount]);
      console.log("Staking account transaction signature:", stakingSignature);

      console.log("Creating proposal account...");
      const createProposalAccountTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: proposalAccount.publicKey,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(8 + 64),
          space: 8 + 64,
          programId: program.programId,
        })
      );

      createProposalAccountTx.recentBlockhash = (await provider.connection.getRecentBlockhash()).blockhash;
      createProposalAccountTx.feePayer = provider.wallet.publicKey;

      createProposalAccountTx.partialSign(proposalAccount);
      await provider.wallet.signTransaction(createProposalAccountTx);

      const proposalSignature = await provider.sendAndConfirm(createProposalAccountTx, [proposalAccount]);
      console.log("Proposal account transaction signature:", proposalSignature);

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

  it('Places an order', async () => {
    const order: Order = {
      order_type: OrderType.Buy,
      amount: new anchor.BN(100),
      price: new anchor.BN(1),
    };

    try {
      const { blockhash } = await provider.connection.getRecentBlockhash();
      let tx = await program.methods.placeOrder(order).accounts({
        market: marketAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }).transaction();

      tx.recentBlockhash = blockhash;
      tx.feePayer = provider.wallet.publicKey;

      tx.partialSign(marketAccount);
      await provider.wallet.signTransaction(tx);

      const signature = await provider.sendAndConfirm(tx, [marketAccount]);
      console.log("Transaction signature:", signature);

      const market = await program.account.market.fetch(marketAccount.publicKey) as Market;
      assert.ok(market.orders.length === 1);
      assert.deepEqual(market.orders[0], order);
    } catch (err) {
      console.error("Failed to place order:", err);
      if (err.logs) {
        console.error("Transaction logs:", err.logs);
      }
    }
  });

  it('Matches orders', async () => {
    // First, we need to place a matching sell order
    const buyOrder: Order = {
      order_type: OrderType.Buy,
      amount: new anchor.BN(100),
      price: new anchor.BN(1),
    };
    const sellOrder: Order = {
      order_type: OrderType.Sell,
      amount: new anchor.BN(100),
      price: new anchor.BN(1),
    };

    try {
      const { blockhash } = await provider.connection.getRecentBlockhash();
      let buyTx = await program.methods.placeOrder(buyOrder).accounts({
        market: marketAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }).transaction();

      buyTx.recentBlockhash = blockhash;
      buyTx.feePayer = provider.wallet.publicKey;
      buyTx.partialSign(marketAccount);
      await provider.wallet.signTransaction(buyTx);

      await provider.sendAndConfirm(buyTx, [marketAccount]);

      let sellTx = await program.methods.placeOrder(sellOrder).accounts({
        market: marketAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }).transaction();

      sellTx.recentBlockhash = blockhash;
      sellTx.feePayer = provider.wallet.publicKey;
      sellTx.partialSign(marketAccount);
      await provider.wallet.signTransaction(sellTx);

      await provider.sendAndConfirm(sellTx, [marketAccount]);

      // Now we match orders
      let matchTx = await program.methods.matchOrders().accounts({
        market: marketAccount.publicKey,
      }).transaction();

      matchTx.recentBlockhash = blockhash;
      matchTx.feePayer = provider.wallet.publicKey;

      matchTx.partialSign(marketAccount);
      await provider.wallet.signTransaction(matchTx);

      const matchSignature = await provider.sendAndConfirm(matchTx, [marketAccount]);
      console.log("Match transaction signature:", matchSignature);

      const market = await program.account.market.fetch(marketAccount.publicKey) as Market;
      assert.ok(market.orders.length === 0);
    } catch (err) {
      console.error("Failed to match orders:", err);
      if (err.logs) {
        console.error("Transaction logs:", err.logs);
      }
    }
  });

  // Test for Liquidity Pool Initialization
  it('Initializes a liquidity pool', async () => {
    const initialLiquidity = new anchor.BN(1000);
    try {
      const { blockhash } = await provider.connection.getRecentBlockhash();
      let tx = await program.methods.initializeLiquidityPool(initialLiquidity).accounts({
        pool: poolAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }).transaction();

      tx.recentBlockhash = blockhash;
      tx.feePayer = provider.wallet.publicKey;

      tx.partialSign(poolAccount);
      await provider.wallet.signTransaction(tx);

      const signature = await provider.sendAndConfirm(tx, [poolAccount]);
      console.log("Transaction signature:", signature);

      const pool = await program.account.liquidityPool.fetch(poolAccount.publicKey) as LiquidityPool;
      assert.ok(pool.total_liquidity.eq(initialLiquidity));
    } catch (err) {
      console.error("Failed to initialize liquidity pool:", err);
      if (err.logs) {
        console.error("Transaction logs:", err.logs);
      }
    }
  });

  // Test for Adding Liquidity
  it('Adds liquidity to the pool', async () => {
    const addAmount = new anchor.BN(500);
    try {
      const { blockhash } = await provider.connection.getRecentBlockhash();
      let tx = await program.methods.addLiquidity(addAmount).accounts({
        pool: poolAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }).transaction();

      tx.recentBlockhash = blockhash;
      tx.feePayer = provider.wallet.publicKey;

      tx.partialSign(poolAccount);
      await provider.wallet.signTransaction(tx);

      const signature = await provider.sendAndConfirm(tx, [poolAccount]);
      console.log("Transaction signature:", signature);

      const pool = await program.account.liquidityPool.fetch(poolAccount.publicKey) as LiquidityPool;
      assert.ok(pool.total_liquidity.eq(new anchor.BN(1500))); // Initial liquidity was 1000
      assert.ok(pool.reserves.eq(new anchor.BN(1500))); // Initial liquidity was 1000
    } catch (err) {
      console.error("Failed to add liquidity:", err);
      if (err.logs) {
        console.error("Transaction logs:", err.logs);
      }
    }
  });

  // Test for Staking Tokens
  it('Stakes tokens', async () => {
    const stakeAmount = new anchor.BN(100);
    try {
      const { blockhash } = await provider.connection.getRecentBlockhash();
      let tx = await program.methods.stakeTokens(stakeAmount).accounts({
        stakingAccount: stakingAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }).transaction();

      tx.recentBlockhash = blockhash;
      tx.feePayer = provider.wallet.publicKey;

      tx.partialSign(stakingAccount);
      await provider.wallet.signTransaction(tx);

      const signature = await provider.sendAndConfirm(tx, [stakingAccount]);
      console.log("Transaction signature:", signature);

      const staking = await program.account.stakingAccount.fetch(stakingAccount.publicKey) as StakingAccount;
      assert.ok(staking.amount.eq(stakeAmount));
    } catch (err) {
      console.error("Failed to stake tokens:", err);
      if (err.logs) {
        console.error("Transaction logs:", err.logs);
      }
    }
  });

  // Test for Claiming Rewards
  it('Claims rewards', async () => {
    try {
      const { blockhash } = await provider.connection.getRecentBlockhash();
      let tx = await program.methods.claimRewards().accounts({
        stakingAccount: stakingAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }).transaction();

      tx.recentBlockhash = blockhash;
      tx.feePayer = provider.wallet.publicKey;

      tx.partialSign(stakingAccount);
      await provider.wallet.signTransaction(tx);

      const signature = await provider.sendAndConfirm(tx, [stakingAccount]);
      console.log("Transaction signature:", signature);

      const staking = await program.account.stakingAccount.fetch(stakingAccount.publicKey) as StakingAccount;
      // Check if rewards claimed have increased (assuming calculate_rewards adds some value)
      assert.ok(staking.rewards_claimed.gt(new anchor.BN(0)));
    } catch (err) {
      console.error("Failed to claim rewards:", err);
      if (err.logs) {
        console.error("Transaction logs:", err.logs);
      }
    }
  });

  // Test for Creating Proposal
  it('Creates a proposal', async () => {
    const description = "Test proposal";
    try {
      const { blockhash } = await provider.connection.getRecentBlockhash();
      let tx = await program.methods.createProposal(description).accounts({
        proposal: proposalAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }).transaction();

      tx.recentBlockhash = blockhash;
      tx.feePayer = provider.wallet.publicKey;

      tx.partialSign(proposalAccount);
      await provider.wallet.signTransaction(tx);

      const signature = await provider.sendAndConfirm(tx, [proposalAccount]);
      console.log("Transaction signature:", signature);

      const proposal = await program.account.proposal.fetch(proposalAccount.publicKey) as any;
      assert.equal(proposal.description, description);
      assert.ok(proposal.votes_for.eq(new anchor.BN(0)));
      assert.ok(proposal.votes_against.eq(new anchor.BN(0)));
    } catch (err) {
      console.error("Failed to create proposal:", err);
      if (err.logs) {
        console.error("Transaction logs:", err.logs);
      }
    }
  });

  // Test for Voting on Proposal
  it('Votes on a proposal', async () => {
    const voteFor = true;
    try {
      const { blockhash } = await provider.connection.getRecentBlockhash();
      let tx = await program.methods.vote(voteFor).accounts({
        proposal: proposalAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }).transaction();

      tx.recentBlockhash = blockhash;
      tx.feePayer = provider.wallet.publicKey;

      tx.partialSign(proposalAccount);
      await provider.wallet.signTransaction(tx);

      const signature = await provider.sendAndConfirm(tx, [proposalAccount]);
      console.log("Transaction signature:", signature);

      const proposal = await program.account.proposal.fetch(proposalAccount.publicKey) as any;
      assert.ok(proposal.votes_for.eq(new anchor.BN(1))); // Assuming the first vote is for the proposal
      assert.ok(proposal.votes_against.eq(new anchor.BN(0))); // Assuming no votes against yet
    } catch (err) {
      console.error("Failed to vote on proposal:", err);
      if (err.logs) {
        console.error("Transaction logs:", err.logs);
      }
    }
  });
});
