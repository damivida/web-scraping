const ethMining = require('./ethMining');
const etcMining = require('./etcMining');
const ltcMining = require('./ltcMining')


const profitability = async() =>  {
  const date = {
    checkTimeUTC: new Date()
  };
  const eth =  await ethMining();
  const etc =  await etcMining()
  const ltc = await ltcMining()

   prof = {date, eth, etc, ltc}

   console.log(prof);
   return prof;

}

profitability();