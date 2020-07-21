const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const profRound = require('./profRound');



//-----------------------------------LITECOINPOOL
async function liteCoinPool(page) {
    
    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://www.litecoinpool.org/stats');
    const html = await page.content();
    const $ = cheerio.load(html);

    const poolName = 'LitecoinPool - LTC';
    let lastBlockTime = $('#stats_pool_time_since_block').text();
    let hp = parseFloat($('#content > div > div > div.optional2.column > table > tbody > tr:nth-child(2) > td:nth-child(3)')
        .text()
        .replace(',',''));
    

    let coinsPerDay = parseFloat($('#content > div > div > div.optional2.column > table > tbody > tr:nth-child(2) > td:nth-child(4)').text());
    let prof = (coinsPerDay/hp)/1000;
    let profitability =  profRound(prof)

    
    //console.log({poolName, hp, coinsPerDay, profitability, lastBlockTime});

    return({poolName, hp, coinsPerDay, profitability, lastBlockTime});
}


//-----------------------------------------------WHAT TO MINE
async function whatToMine(page) {

    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://whattomine.com/coins/4-ltc-scrypt');
    const html = await page.content();
    const $ = cheerio.load(html);

    const val1 = $('#hr').val();
    const val2 = $('.table-active > td:nth-child(3)').text();

    await page.setDefaultNavigationTimeout(0);
    const poolName = 'What to mine - LTC';
    const lastBlockTime = '';
    let hp = parseFloat(val1);
    let coinsPerDay = parseFloat(val2.replace('\n', '').replace('\n', ''));
    const prof = val2/val1;
    let profitability =  profRound(prof);

    //console.log({poolName,hp, coinsPerDay, profitability, lastBlockTime});
    return({poolName, hp, coinsPerDay, profitability, lastBlockTime});
       
}


//--------------------------------------------MAIN
const ltcMining = async () => {
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();

        //---------------profitability calc
        let arrProf = [];
        const getSum = (total, numb) => {
            return total + numb;
        }

        
        let scrapWhatToMineLTC = await whatToMine(page);
        let profWhatToMineLTC = scrapWhatToMineLTC.profitability;
        arrProf.push(profWhatToMineLTC);

        let scrapLitecoinPool = await liteCoinPool(page);
        let profLitecoinPool = scrapLitecoinPool.profitability;
        arrProf.push(profLitecoinPool)

       let profAvg = arrProf.reduce(getSum);
       profAvg = parseFloat((profAvg /arrProf.length).toFixed(8));

       //-------------------

    const ltcMining = {
        wahatToMineLTC: scrapWhatToMineLTC,
        litecoinPoolLTC: scrapLitecoinPool,
        ltcAvgProfitability: profAvg
    }

   // console.log(ltcMining);
    return ltcMining;
}


///ltcMining();
module.exports = ltcMining;
