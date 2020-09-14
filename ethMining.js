const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const profRound = require('./profRound');


//MINING POOL HUB
async function miningPoolHubETH(page) {

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
    let prof = (coinsPerDay/hp)*1000;
    let profitability =  profRound(prof)
    
    //console.log({poolName, hp, coinsPerDay, profitability, lastBlockTime});

    return({poolName, hp, coinsPerDay, profitability, lastBlockTime});

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
    let coinsPerDay = parseFloat($('#row0TableBestMinersETH > td:nth-child(4)').text());
    let prof = (coinsPerDay/hp)/1000;
    let profitability =  profRound(prof)

  
    //console.log({poolName,hp, coinsPerDay, profitability, lastBlockTime});

    return({poolName, hp, coinsPerDay, profitability, lastBlockTime});

    }catch(err) {
        console.log(err);

    }

}

//WHAT TO MINE
async function whatToMine(page) {

    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://whattomine.com/coins/151-eth-ethash');
    const html = await page.content();
    const $ = cheerio.load(html);

    const val1 = $('#hr').val();
    const val2 = $('.table-active > td:nth-child(3)').text();
   
    
    /* await page.click('#hr', {clickCount:2},);
    await page.type('#hr', '1')
    await page.click('#cost', {clickCount:2},);
    await page.type('#cost', '0.0');
    //await page.waitForSelector('.')
     await page.focus('#');
    await page.click('.btn-primary');
    //await page.waitForSelector('body > div.container > div:nth-child(6) > div.col-8 > table:nth-child(3) > tbody > tr.table-active > td:nth-child(3)');
    let profitability = $('.table-active > td:nth-child(3)').text() */


    const poolName = 'What to mine - ETH';
    const lastBlockTime = '';
    let hp = parseFloat(val1);
    let coinsPerDay = parseFloat(val2.replace('\n', '').replace('\n', ''));
    const prof = val2/val1;
    let profitability =  profRound(prof);

    //console.log({poolName,hp, coinsPerDay, profitability, lastBlockTime});
    return({poolName, hp, coinsPerDay, profitability, lastBlockTime});
    
    
}




//POOL VIA BTC
async function viaBtc(page) {

    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://www.viabtc.com/tools/calculator?symbol=ETH');
    const html = await page.content();
    const $ = cheerio.load(html);


    const poolName = 'VIA BTC - ETH';
   //const lastBlockTime = '';
    const fee =  0.035;
    const profitabilityWithFee = parseFloat($('.f-z-36').text());
    const profitability = parseFloat((profitabilityWithFee + (profitabilityWithFee*fee)).toFixed(8));

    //console.log({poolName, fee, profitabilityWithFee, profitability});
    return({poolName, fee, profitabilityWithFee, profitability});
     
    
}

//F2POOL
async function f2pool() {

    /* const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage(); */

    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://www.f2pool.com/');
    const html = await page.content();
    const $ = cheerio.load(html);


    const poolName = '';
    
    //const val1 = $('#__layout > div > div.g-doc > div > div.index > div > div.box.mt40.mb40.pb20 > div:nth-child(2) > div.calc-main.el-row > div:nth-child(3) > div > section:nth-child(2) > span > input').attr('value');
    await page.waitForSelector('#tab-content-main > table > tbody > tr.row-common.row-etc > td:nth-child(7) > a.btn-tool.btn-circle.btn-collapse.collapsed.d-none.d-lg-inline-block');
    await page.click('#tab-content-main > table > tbody > tr.row-common.row-etc > td:nth-child(7) > a.btn-tool.btn-circle.btn-collapse.collapsed.d-none.d-lg-inline-block'); 
   // await page.waitForSelector('#ContentPlaceHolder1_divresults > div > table > tbody > tr:nth-child(2) > td:nth-child(2)');
   //const prof = $('#ContentPlaceHolder1_divresults > div > table > tbody > tr:nth-child(2) > td:nth-child(2)').text();
    //console.log(val1);
    
}



const ethMining =  async () => {
    const browser = await puppeteer.launch({headless:false});
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

    let scrapWhatToMineETH = await whatToMine(page);
    let profWhatToMineETH = scrapWhatToMineETH.profitability;
    arrProf.push(profWhatToMineETH)

    let scrapViaBtc = await viaBtc(page);
    let profViaBtc = scrapViaBtc.profitability;
    arrProf.push(profViaBtc);

   
    //arrProf.reduce(getSum)

    let profAvg = arrProf.reduce(getSum);
    profAvg = parseFloat((profAvg /arrProf.length).toFixed(8));

    //--------------------------------

    const ethMining =  {
        miningPoolHubETH: scrapMiningPoolHubETH,
        coinotronETH: scrapCoinotronETH,
        wahatToMineETH: scrapWhatToMineETH,
        viaBtcETH: scrapViaBtc,
        ethAvgProfitability: profAvg
    }


   //console.log(ethMining)
    return ethMining;
}



ethMining();
module.exports = ethMining;

//f2pool();