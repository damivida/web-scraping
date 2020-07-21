const request = require("request-promise");
const cheerio = require("cheerio");

async function main() {
    const result = await request.get('https://www.codingwithstefan.com/table-example');
    const $ = cheerio.load(result);

    const scrapedRows = [];

    //loop through the selector
    $("body > table > tbody > tr").each((index, element) => {

        //skip the firs index of an array
        if (index === 0) return true;

        //find the td of each (element) tr
        const tds = $(element).find('td');

        //find the first, sec, third td of each (element) tr
        const company = $(tds[0]).text();
        const contact = $(tds[1]).text();
        const country = $(tds[2]).text();

        //creating an object and pushing to an array
        const scrapedRow = {company, contact, country};
        scrapedRows.push(scrapedRow);

  });

  console.log(scrapedRows);

}

main();