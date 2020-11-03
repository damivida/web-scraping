const mongoose = require('mongoose');
const cheerio = require('cheerio');
require('./db/mongoose');
const puppeteer = require('puppeteer');

const RedditArticle = require('./models/reddit-article');
const ScrapingModel = require('./models/mining-prof');


async function main() {
    try {
        const browser = await puppeteer.launch({headless:true});
        const page = await browser.newPage();

        await page.setDefaultNavigationTimeout(0);
        await page.goto('https://www.reddit.com/');
        const html = await page.content();
        const $ = cheerio.load(html);

        const titles = $('h3');

       // const tag = $('#wrapper > div.container.coins > div.gecko-table-container > div.coingecko-table > div.position-relative > div > div > table > tbody > tr:nth-child(1) > td.td-price.price.text-right > span').text();

       let date = new Date();
         titles.each(async (i, element) => {
           try {

            let title = $(element).text();
            //console.log(title);
            const article = new RedditArticle({title, date});

           await article.save();
            console.log('Articles saved');

           }catch(e) {
            console.log(e);
           }
           
                
        });

    }catch(e) {
        console.log(e);
    }
}

//main();


async function miningPoolHubETH(page) {

    try {
      await page.setDefaultNavigationTimeout(0);
      await page.goto('https://ethereum.miningpoolhub.com/index.php?page=statistics&action=pool');
      const html = await page.content();
      const $ = cheerio.load(html);
  
      const poolName = 'Mining Pool Hub - ETH';
      let lastBlockTime = $('#main > div:nth-child(2) > article:nth-child(2) > div > table > tbody > tr:nth-child(8) > td').text();
      let hp = parseFloat($('#main > div:nth-child(2) > article:nth-child(1) > div > table > tbody > tr:nth-child(1) > td:nth-child(4)')
        .text()
        .replace(',', '')
        .replace(',', '')
        .replace(',', ''));
  
      let coinsPerDay = parseFloat($('#main > div:nth-child(2) > article:nth-child(1) > div > table > tbody > tr:nth-child(1) > td:nth-child(5)').text());
      let prof = (coinsPerDay / hp) * 1000;
      let profitability = profRound(prof)
      let url = 'https://ethereum.miningpoolhub.com/index.php?page=statistics&action=pool';
  
      //console.log({poolName, hp, coinsPerDay, profitability, lastBlockTime});
  
      return ({ poolName, profitability, url });
    
    } catch (error) {
      
      return error;
    }


  }

  //COINOTRON
  async function coinotronETH(page) {

    try {

      await page.setDefaultNavigationTimeout(0);
      await page.goto('https://www.coinotron.com/app?action=statistics');
      const html = await page.content();
      const $ = cheerio.load(html);

      const poolName = 'Coinotron - ETH';
      const lastBlockTime = $('#row0TableSolvedBlocksETH > td:nth-child(2)').text();
      let hp = parseFloat($('#row0TableBestMinersETH > td:nth-child(3)').text().replace('GH', ''));
      let hpDenom = $('#row0TableBestMinersETH > td:nth-child(3)').text();
      hpDenom = hpDenom.slice((hpDenom.length)-2,hpDenom.length);
      let coinsPerDay = parseFloat($('#row0TableBestMinersETH > td:nth-child(4)').text());
     
      let prof = coinotronDenom(hp, hpDenom, coinsPerDay);
      let profitability = profRound(prof);
     
      let url = 'https://www.coinotron.com/app?action=statistics';


      return ({ poolName, profitability,  url });

    } catch (err) {
      return err;

    }

  }

  //F2POOL
  async function f2pool(page) {
    try {

      /* const browser = await puppeteer.launch({headless:false});
      const page = await browser.newPage(); */

      await page.setDefaultNavigationTimeout(0);
      await page.goto('https://www.f2pool.com/');
      const html = await page.content();
      const $ = cheerio.load(html);


      const poolName = 'F2Pool';
      const profWithFee = parseFloat($("#tab-content-main > table > tbody > tr:nth-child(10) > td > div > div > div.container-info.col-12.col-lg-6 > div > div.row.info-item.calc-inline.hash-val-container > div > div:nth-child(4) > span.pl-1.profit-val.info-value").text().trim());
      const fee = parseFloat($('#tab-content-main > table > tbody > tr:nth-child(10) > td > div > div > div.container-info.col-12.col-lg-6 > div > div:nth-child(5) > div.col-12.col-lg-4.item > div.info-value').text().replace('% PPS+', ''));
      const profitability = parseFloat((profWithFee / ((100 - fee) / 100)).toFixed(8));
      const url = 'https://www.f2pool.com/';

      //console.log({profWithFee, fee, profitability});
      return ({ poolName, profitability, url });

    } catch (error) {
      
      return error;
    }

  }


  const ethScraping = async () => {
    const browser = await puppeteer.launch({ headless: true , args: ["--no-sandbox"]});
    const page = await browser.newPage();


    //profitability calc
    let arrProf = [];
    const getSum = (total, numb) => {
      return total + numb;
    }

    let scrapMiningPoolHubETH = await miningPoolHubETH(page);
    let profMiningPoolHubETH = scrapMiningPoolHubETH.profitability;
    arrProf.push(profMiningPoolHubETH)

    let scrapCoinotronETH = await coinotronETH(page);
    let profCoinotronETH = scrapCoinotronETH.profitability;
    arrProf.push(profCoinotronETH)

    let scrapingF2PoolETH = await f2pool(page);
    let profF2PoolETH = scrapingF2PoolETH.profitability;
    arrProf.push(profF2PoolETH);


    //arrProf.reduce(getSum)

    let profAvg = arrProf.reduce(getSum);
    profAvg = parseFloat((profAvg / arrProf.length).toFixed(8));

    //--------------------------------

    const ethMiningPools = {
      miningPoolHubETH: scrapMiningPoolHubETH,
      coinotronETH: scrapCoinotronETH,
      f2PoolETH: scrapingF2PoolETH,
      avgETHProf: profAvg
    }
    //console.log(ethMining)

    //res.send({ ethMiningPools });

    try {

        let date = new Date();
        const miningResult =  new ScrapingModel({minigPool:ethMiningPools, date});
   
           await miningResult.save();
           console.log('Scraping ETH results saved');

    } catch(e) {
        console.log(e);
    }

    //return ethMiningPools;
    
  }

  ///--------------------------


  

 //F2POOL
 async function f2poolETC(page) {
    try {

      await page.setDefaultNavigationTimeout(0);
      await page.goto('https://www.f2pool.com/');
      const html = await page.content();
      const $ = cheerio.load(html);


      const poolName = 'F2Pool';
      const profWithFee = parseFloat($("#tab-content-main > table > tbody > tr:nth-child(12) > td > div > div > div.container-info.col-12.col-lg-6 > div > div.row.info-item.calc-inline.hash-val-container > div > div:nth-child(4) > span.pl-1.profit-val.info-value").text().trim());
      const fee = parseFloat($("#tab-content-main > table > tbody > tr:nth-child(12) > td > div > div > div.container-info.col-12.col-lg-6 > div > div:nth-child(5) > div.col-12.col-lg-4.item > div.info-value").text().replace('% PPS', ''));
      const profitability = parseFloat((profWithFee / ((100 - fee) / 100)).toFixed(8));
      const url = 'https://www.f2pool.com/';

      // console.log({profWithFee, fee, profitability});
      return ({ poolName, profWithFee, fee, profitability, url });

    } catch (error) {
      return error;
    }

  }


  //COINOTRON
  async function coinotronETC(page) {
  
    try {

      await page.setDefaultNavigationTimeout(0);
      await page.goto('https://www.coinotron.com/app?action=statistics');
      const html = await page.content();
      const $ = cheerio.load(html);
  
      const poolName = 'Coinotron - ETC';
      const lastBlockTime = $('#row0TableSolvedBlocksETC > td:nth-child(2)').text();
      const hp = parseFloat($('#row0TableBestMinersETC > td:nth-child(3)').text().replace(' GH', ''));
      let hpDenom = $('#row0TableBestMinersETC > td:nth-child(3)').text();
      hpDenom = hpDenom.slice((hpDenom.length)-2,hpDenom.length);
      let coinsPerDay = parseFloat($('#row0TableBestMinersETC > td:nth-child(4)').text());
      

      let prof = coinotronDenom(hp, hpDenom, coinsPerDay);
          
      let profitability = profRound(prof);

      let url = 'https://www.coinotron.com/app?action=statistics';
  
      return ({ poolName, hp, coinsPerDay, profitability, lastBlockTime, url });
      
    } catch (error) {
      return error;
    }
   
  }


 
  const etcScraping = async () => {

    const browser = await puppeteer.launch({ headless: true , args: ["--no-sandbox"] });
    const page = await browser.newPage();

    //profitability calc
    let arrProf = [];
    const getSum = (total, numb) => {
      return total + numb;
    }

    let scrapF2PoolETC = await f2poolETC(page);
    let scrapCoinotronETC = await coinotronETC(page);
    
    let profCoinotronETC = scrapCoinotronETC.profitability;
    let profF2PoolETC = scrapF2PoolETC.profitability;

    arrProf.push(profCoinotronETC, profF2PoolETC)

    //arrProf.reduce(getSum);

    let profAvg = arrProf.reduce(getSum);
    profAvg = parseFloat((profAvg / arrProf.length).toFixed(8));

    //-------------------

    const etcMiningPools = {
      coinotronETC: scrapCoinotronETC,
      f2PoolETC: scrapF2PoolETC,
      avgETCProf: profAvg
    }
    //console.log(etcMining)
    
    try {

        let date = new Date();
        const miningResult =  new ScrapingModel({minigPool:etcMiningPools, date});
   
           await miningResult.save();
           console.log('Scraping ETC result saved');

    } catch(e) {
        console.log(e);
    }
 
  }


etcScraping();
ethScraping();

  