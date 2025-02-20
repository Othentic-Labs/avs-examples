require('dotenv').config();
const axios = require("axios");
const { ethers } = require("ethers")
const aggregatorV3InterfaceABI = require("./abi/aggregatorV3Interface");

// Set default values for Sepolia
const DEFAULT_RPC_URL = "https://rpc.ankr.com/eth_sepolia";
const DEFAULT_VOLATILITY_FEED_ADDRESS = "0x31D04174D0e1643963b38d87f26b0675Bb7dC96e";
const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL || DEFAULT_RPC_URL);
const ETH_USD_24HR_VOLATILITY_ADDRESS = process.env.VOLATILITY_FEED_ADDRESS || DEFAULT_VOLATILITY_FEED_ADDRESS;

function calculateFee(marketVolatility) {
  const baseFee = 3.5;
  const maxFee = 5.5;
  const tradeThreshold = 150; // ETH
  const volatilityThreshold = 0.60; // 60%

  let fee = 2 * Math.pow((marketVolatility / volatilityThreshold), 2) + baseFee;

  return Math.min(fee, maxFee); 
}

async function getVolatility() {
  try {
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT`);
    const priceChangePercent = parseFloat(response.data.priceChangePercent) / 100; // Convert to decimal
    const volatility = Math.abs(priceChangePercent); // Simple absolute price change as volatility
    
    console.log("Fetched Volatility:", volatility);
    return volatility;
  } catch (err) {
    console.error("Error fetching volatility:", err.message);
    return null;
  }
}

async function getVolatilityUsingChainlink() {
  try {
    const volatilityFeed = new ethers.Contract(ETH_USD_24HR_VOLATILITY_ADDRESS, aggregatorV3InterfaceABI, provider);
    const decimals = await volatilityFeed.decimals();
    const roundData = await volatilityFeed.latestRoundData();
    const volatility = Number(roundData[1]) / 10 ** Number(decimals);
    return volatility;
  } catch (err) {
    console.error("Error fetching volatility from Chain Link contracts:", err.message);
    return null;
  }
}

async function getFee() {
  var res = null;
    try {
        // const volatility = await getVolatilityUsingChainlink(); // ETHUSD
        const volatility = await getVolatility(); // ETHUSDT
        var fee = calculateFee(volatility);
        console.log("Calculated Fee", fee);
        res = fee
    } catch (err) {
      console.error("Error calculating fee:" + err)
    }
    return res;
  }
  
  module.exports = { getFee }