require('dotenv').config();

const {MongoClient} = require('mongodb');
const express = require('express');
const cors = require('cors');
const { Keypair } = require('@solana/web3.js');
const { combineAndDeduplicateData,  placePerpsOrder } = require('./services/tokenService');
const axios = require('axios');

const getMintAddress = async(symbol)=>{
    try{
      const collection = database.collection('mint_addresses');
      const result = await collection.findOne({ symbol: symbol }, { projection: { address: 1, decimal: 1 } });
      if(result){
        return {address:result.address, decimal:parseInt(result.decimal,10)};
      }
      else{
        return 'no mint address';
      }
    }
    catch(error){
      console.error("Error occurd getting mint address", error);
    }
  }