import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/presale.css';
/*
import {
  Program,
  AnchorProvider,
  setProvider,
  // getProvider,
  BN
} from "@project-serum/anchor";
*/
import { Program,BN } from "@coral-xyz/anchor";
import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useAnchorWallet,
  useWallet,
} from "@solana/wallet-adapter-react";

import {
  clusterApiUrl,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  Connection
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress
} from "@solana/spl-token";
import IDL from '../idl/idl.json';
import { PROGRAM_ID, VAULT_SEED, TOKEN_VAULT_SEED, PRESALE_SEED, tokenMintAddress, USER_INFO_SEED, connection } from '../config';

const opts = {
  preflightCommitment:"processed",
};

const YieldFarmingPage = () => {
  const [selectedPool, setSelectedPool] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [addLiquidityAmount, setAddLiquidityAmount] = useState('');
  const [removeLiquidityAmount, setRemoveLiquidityAmount] = useState('');
  const [pools, setPools] = useState([]);
  const { wallet, publicKey, connected, sendTransaction } = useWallet();
  const [program, setProgram] = useState(null);
  const [tokenAmount, setTokenAmount] = useState(0);

  const [tokenBalance, setTokenBalace] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [status, setStatus] = useState(false);
  const [saleType, setSaleType] = useState(false);

  const [period, setPeriod] = useState(3);
  const [userData, setUserData] = useState(null);

  // const connection = new Connection(clusterApiUrl('devnet'));

  // useEffect(()=>{
  //   const fetchPools = async ()=> {
  //     const res = await axios.get('https://docs-demo.stellar-mainnet.quiknode.pro/liquidity_pools');
  //     console.log("Pools:", res);
  //   }
  //   fetchPools();
  // });

  useEffect(() => {
    if(!publicKey)
      init();
  }, [publicKey]);

  const getProvider = () => {
    const provider = new AnchorProvider(
      connection,
      wallet.adapter,
      opts.preflightCommitment
    );
    return provider;
  };

  const init = async() => {
    // let provider;
    // try {
    //   provider = getProvider();
    // } catch {
    //   if(wallet != undefined) {
    //     // setProvider(provider);
    //   } else {
    //     const keypair = Keypair.generate();
    //     provider = new AnchorProvider(connection, {
    //       publicKey: keypair.publicKey,
    //       signAllTransactions: (txs) => Promise.resolve(txs),
    //       signTransaction: (tx) => Promise.resolve(tx),
    //     }, {});
    //     // setProvider(provider);
    //   }
    // }
    const program = new Program(IDL, PROGRAM_ID, {connection});
    const [presale, presaleBump] = await PublicKey.findProgramAddress(
      [
        Buffer.from(PRESALE_SEED)
      ],
      program.programId
    );
    const preSaleData = await program.account.presale.fetch(presale);
    setTokenBalace(Number(preSaleData.tokenAmount) / 10 ** 8);
    setTokenPrice(Number(preSaleData.tokenPrice) / 10 ** 9);
    setStatus(preSaleData.status);
    setSaleType(preSaleData.saleType);

    try {
      const [userInfo, userInfoBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from(USER_INFO_SEED),
          publicKey.toBuffer()
        ],
        program.programId
      );
      const userInfoData = await program.account.userInfo.fetch(userInfo);
      console.log(userInfoData);
      setUserData(userInfoData);
   } catch (error) {
    console.log(error);
   }
  }

  const fetchData = () => {
    try {
      if (!publicKey) return;
      if(userData == null) return;
  
      const stakingData = [
        { period: 3, amount: userData.stakeAmount3M, startTime: Number(userData.stakeStartTime3M), status: userData.stakeStatus3M, reward:'5%' },
        { period: 6, amount: userData.stakeAmount6M, startTime: Number(userData.stakeStartTime6M), status: userData.stakeStatus6M , reward:'10%' },
        { period: 9, amount: userData.stakeAmount9M, startTime: Number(userData.stakeStartTime9M), status: userData.stakeStatus9M, reward:'15%'  },
        { period: 12, amount: userData.stakeAmount12M, startTime: Number(userData.stakeStartTime12M), status: userData.stakeStatus12M , reward:'20%' },
      ];
      console.log(stakingData);
  
      return (
        <div className="staking-details">
          <table className="staking-table">
            <thead>
              <tr>
                <th>Staking Period</th>
                <th>Amount Staked (Tokens)</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reward Rate</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stakingData.map(({ period, amount, startTime, reward, status }, index) => {
                if (amount > 0) {
                  const endTime = startTime + period * 30 * 24 * 60 * 60; // Calculate end time (approximate)
                  const startDate = new Date(startTime * 1000).toLocaleDateString();
                  const endDate = new Date(endTime * 1000).toLocaleDateString();

                  return (
                    <tr key={index} className="staking-period-details">
                      <td>{period} Months</td>
                      <td>{(Number(amount) / 10 ** 8).toFixed(2)}</td>
                      <td>{startDate}</td>
                      <td>{endDate}</td>
                      <td>{reward}</td>
                      <td>{status ? 'Active' : 'Inactive'}</td>
                      <td><button onClick={() => handleClaimToken(period)}>Claim</button></td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      );
    } catch (error) {
      console.log(error);
    }
  };
  

  const handleBuyToken = async() => {
    try {
      if(!publicKey) return;
      
      const program = new Program(IDL, PROGRAM_ID, {connection});
      let amount = 0;
      if(saleType) {
        // public sale
        amount = tokenAmount * 10 ** 8;

      } else {
        // private sale
        amount = tokenPrice * tokenAmount * LAMPORTS_PER_SOL;
      }
      const tokenMint = new PublicKey(tokenMintAddress);

      const userTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        publicKey
      );

      const [presale, presaleBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from(PRESALE_SEED)
        ],
        program.programId
      );
  
      const [vault, vaultBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from(VAULT_SEED)
        ],
        program.programId
      );
  
      const [tokenVault, tokenVaultBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from(TOKEN_VAULT_SEED),
          tokenMint.toBuffer()
        ],
        program.programId
      );

      const [userInfo, userInfoBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from(USER_INFO_SEED),
          publicKey.toBuffer()
        ],
        program.programId
      );

      const transaction = await program.methods
      .tokenSale(new BN(amount),period)
      .accounts({
        user: publicKey,
        userInfo,
        presale,
        vault,
        tokenMint,
        tokenAccount:userTokenAccount,
        tokenVaultAccount: tokenVault,
        tokenProgram:TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId
      })
      .transaction();
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const response = await connection.simulateTransaction(transaction);
      console.log("response->", response);
      console.log("transaction->", transaction);


      const transactionSignature = await sendTransaction(
        transaction,
        connection
      );
      console.log("transactionSignature->", transactionSignature);
    } catch (error) {
      console.log(error);
    }
  }

  const handleClaimToken = async(period) => {
    try {
      if(!publicKey) return;
      
      const provider = getProvider();
      const program = new Program(IDL, PROGRAM_ID, provider);
  
      const tokenMint = new PublicKey(tokenMintAddress);

      const userTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        publicKey
      );

      const [presale, presaleBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from(PRESALE_SEED)
        ],
        program.programId
      );
  
      const [vault, vaultBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from(VAULT_SEED)
        ],
        program.programId
      );
  
      const [tokenVault, tokenVaultBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from(TOKEN_VAULT_SEED),
          tokenMint.toBuffer()
        ],
        program.programId
      );

      const [userInfo, userInfoBump] = await PublicKey.findProgramAddress(
        [
          Buffer.from(USER_INFO_SEED),
          publicKey.toBuffer()
        ],
        program.programId
      );

      const tx = await program.rpc.claimStakedToken(
        period,{
          accounts: {
            user: publicKey,
            userInfo,
            presale,
            vault,
            tokenMint,
            tokenAccount:userTokenAccount,
            tokenVaultAccount: tokenVault,
            tokenProgram:TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId
          },
        }
      );
      console.log("tx->", tx);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="yield-farming-page">
      <h1>CTX Presale</h1>
      <p>Welcome to the CTX presale section of the Ecosystem. Buy tokens!</p>

      <div className="presale">
        {saleType?<label>Token Amount (Public Sale)</label>:<label>Token Amount (Private Sale)</label>}
       
        <input type='number' min={0} step={1} onChange={(e)=>setTokenAmount(Number(e.target.value))} className='presale-amount'/>
        
        <div className='presale-staking-period'>
          <button className={period == 3?'presale-staking-period-btn-active':'presale-staking-period-btn'} onClick={() => setPeriod(3)}>3 months</button>
          <button className={period == 6?'presale-staking-period-btn-active':'presale-staking-period-btn'} onClick={() => setPeriod(6)}>6 months</button>
          <button className={period == 9?'presale-staking-period-btn-active':'presale-staking-period-btn'} onClick={() => setPeriod(9)}>9 months</button>
          <button className={period == 12?'presale-staking-period-btn-active':'presale-staking-period-btn'} onClick={() => setPeriod(12)}>12 months</button>
        </div>

        {!saleType && <label>Token Pice {tokenPrice}SOL</label>}
        <button className='presale-btn' onClick={() => handleBuyToken()}>Buy Token</button>
        
      </div>
      <div className="staking-info">
          {fetchData()}
        </div>
    </div>
  );
};

export default YieldFarmingPage;
