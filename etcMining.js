const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const profRound = require('./profRound');

async function coinotronETC(page) {

    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://www.coinotron.com/app?action=statistics');
    const html = await page.content();
    const $ = cheerio.load(html);

    const poolName = 'Coinotron - ETC';
    const lastBlockTime = $('#row0TableSolvedBlocksETC > td:nth-child(2)').text();
    const hp = parseFloat($('#row0TableBestMinersETC > td:nth-child(3)').text().replace('GH', ''));
    let coinsPerDay = parseFloat($('#row0TableBestMinersETC > td:nth-child(4)').text());
    let prof = (coinsPerDay/hp)/1000;
    let profitability =  profRound(prof)

    return({poolName, hp, coinsPerDay, profitability, lastBlockTime});
}


//WHAT TO MINE
async function whatToMine(page) {

    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://whattomine.com/coins/162-etc-ethash');
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

    await page.setDefaultNavigationTimeout(0);
    const poolName = 'What to mine - ETC';
    const lastBlockTime = '';
    let hp = parseFloat(val1);
    let coinsPerDay = parseFloat(val2.replace('\n', '').replace('\n', ''));
    const prof = val2/val1;
    let profitability =  profRound(prof);

    //console.log({poolName,hp, coinsPerDay, profitability, lastBlockTime});
    return({poolName, hp, coinsPerDay, profitability, lastBlockTime});    
    
}


const etcMining = async () => {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

        //profitability calc
        let arrProf = [];
        const getSum = (total, numb) => {
            return total + numb;
        }

        let scrapCoinotronETC = await coinotronETC(page);
        let profCoinotronETC = scrapCoinotronETC.profitability;
        arrProf.push(profCoinotronETC)

        let scrapWhatToMineETH = await whatToMine(page);
        let profWhatToMineETH = scrapWhatToMineETH.profitability;
        arrProf.push(profWhatToMineETH);

        //arrProf.reduce(getSum);

       let profAvg = arrProf.reduce(getSum);
       profAvg = parseFloat((profAvg /arrProf.length).toFixed(8));

       //-------------------

    const etcMining = {
        coinotronETC: scrapCoinotronETC,
        wahatToMineETH: scrapWhatToMineETH,
        etcAvgProfitability: profAvg
    }
   //console.log(etcMining)
    return etcMining;
}


//etcMining();
module.exports = etcMining;
