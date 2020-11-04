const mongoose = require('mongoose');
require('./db/mongoose');
const axios = require('axios');
const averageFunc = require('./functions/averageFunc');
const ScrapingModel = require('./models/mining-prof')

const ethApi =  () => {

    const whatToMineUrl = `https://whattomine.com/coins/151.json?hr=1&p=0.0&fee=0&cost=0&hcost=0.07`;
    const viaBtcUrl = `https://www.viabtc.com/res/tools/calculator?coin=ETH`;
    const poolInUrl = 'https://api-prod.poolin.com/api/public/v2/basedata/coins/block_stats';
  
    const whatToMineRequest = axios.get(whatToMineUrl);
    const viaBtcRequest = axios.get(viaBtcUrl);
    const poolInRequest = axios.get(poolInUrl);
  
  
    axios.all([whatToMineRequest, viaBtcRequest, poolInRequest]).then(axios.spread((...responses) => {
      const whatToMineResponse = responses[0].data;
      const viaBtcResponse = responses[1].data;
      const poolInResponse = responses[2].data;
  
      const viaBtcProf = viaBtcResponse["data"][0]["profit"]["ETH"];
      const fee = viaBtcResponse["data"][0]["pps_fee_rate"];
      const correctionFactor = 0.004;
      const feeCorrected = fee - correctionFactor;
      let viaBtcProfNoFee = (viaBtcProf/((100-(feeCorrected*100))/100)).toFixed(8);
  
      const whatToMineData = {
        poolName: "WhatToMine",
        profitability: whatToMineResponse["estimated_rewards"],
        url: 'https://whattomine.com/coins/151-eth-ethash?hr=1&p=420.0&fee=0.0&cost=0.0&hcost=0.0&commit=Calculate'
      }
  
      const viaBtcData = {
        poolName: "ViaBtc",
        fee: fee,
        miningRewardWithFee: viaBtcResponse["data"][0]["profit"]["ETH"],
        profitability: viaBtcProfNoFee,
        url: 'https://www.viabtc.com/tools/calculator?symbol=ETH'
      }
  
      const poolInData = {
        poolName: "Poolin",
        profitability: poolInResponse["data"]["ETH"]["rewards_per_unit"],
        url: 'https://www.poolin.com/tools/mini-calc?type=eth'
      }
  
  
      let allProfArr = [parseFloat(whatToMineData.profitability), parseFloat(viaBtcData.profitability), parseFloat(poolInData.profitability)];
  
      const avgEthMiningProf = {
        avgETHProf: averageFunc(allProfArr)
      }
  
      const ethMiningPools = { whatToMineData, viaBtcData, poolInData, avgEthMiningProf };
      //res.send({ ethMiningPools });

      let date = new Date();
      const miningResult =  new ScrapingModel({minigPool:ethMiningPools, date});
   
           miningResult.save();
           console.log('Scraping ETH results saved');
  
    })).catch(errors => {

      console.log({errors})
    })
}

ethApi();