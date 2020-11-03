const puppeteer = require('puppeteer');
const cheerio = require('cheerio');


//F2POOL
async function f2pool() {

    try {

        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();
    
        await page.setDefaultNavigationTimeout(0);
        await page.goto('https://www.f2pool.com/');
        const html = await page.content();
        const $ = cheerio.load(html);
    
    
        const poolName = 'F2Pool';
        const profWithFee = parseFloat($("#tab-content-main > table > tbody > tr:nth-child(10) > td > div > div > div.container-info.col-12.col-lg-6 > div.row.calc-inline.hash-val-container > div > div:nth-child(4) > span.pl-1.profit-val.info-value").text().trim());
        const fee = parseFloat($('#tab-content-main > table > tbody > tr:nth-child(10) > td > div > div > div.container-info.col-12.col-lg-6 > div.row.info-content > div:nth-child(8) > span.info-value').text().replace('% PPS+', ''));
        const profitability = parseFloat((profWithFee/((100-2.5)/100)).toFixed(8));
    
        const test = 'test';
        console.log({profWithFee, fee, profitability});
        return({poolName, profWithFee, fee});
    } catch {
        console.error(error);
    }
  
}


f2pool()