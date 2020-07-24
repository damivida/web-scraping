const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');



//function for scraping main data(Listings)
async function scrapeListings(page) {
    await page.goto('https://sfbay.craigslist.org/d/technical-support/search/tch?lang=en&cc=gb');

    const html = await page.content();
    const $ = cheerio.load(html);

    //used map() function to extract data from class (get() method is mandatory since map() function is used with cheerio)
    const listings = $('.result-info')
        .map((index, element) => {
          const titleElement = $(element).find('.result-title');
          const dateElement = $(element).find('.result-date');
          const hoodElement = $(element).find('.result-hood');

          const title = titleElement.text()
          const url = titleElement.attr('href');
          const date = new Date(dateElement.attr('datetime'));
          const hood = hoodElement.text().trim().replace('(', '').replace(')', '');

          return {title, url, date, hood};
    }).get()

    return listings;

}

// get job description and append it to an existing object
async function scrapeJobDescriptions(listings, page) {
    for(let i = 0; i < listings.length; i++)  {
        await page.goto(listings[i].url);
        const html = await page.content();
        const $ = cheerio.load(html);
        const jobDescription = $('#postingbody').text();
        const compensation = $('p.attrgroup > span:nth-child(1) > b').text();
        listings[i].jobDescription = jobDescription;
        listings[i].compensation = compensation;
        console.log(listings[i].jobDescription = jobDescription);
        console.log(listings[i].compensation = compensation);
        await sleep(1000); //1 sec sleep
    }

}

//function to wait a certain number of seconds
async function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

//function to convet array to csv
async function createCsvFile(data) {
    const csv = new ObjectsToCsv(data);
 
  // Save to file:
  await csv.toDisk('./craigList.csv');
 
 
}

//instatiate puppeteer and call other functions
async function main() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const listings = await scrapeListings(page);
    const listingsWithJobDecsriptions = await scrapeJobDescriptions(listings, page);
    await createCsvFile(listingsWithJobDecsriptions)
    //console.log(listingsWithJobDecsriptions);
}


main();