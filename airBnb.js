const puppeteer = require('puppeteer');
const cheerio = require('cheerio');


const sample = {
    guests: 1,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    krPerNight: 350
}

async function scrapeHomeInIndexPage(url) {
    try {
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();
        await page.goto(url);
        const html = await page.evaluate(() => document.body.innerHTML);
        const $ = cheerio.load(html);

    } catch {
        console.error(error);
    }
}
//const url = 'https://hr.airbnb.com/s/Copenhagen/homes?refinement_paths%5B%5D=%2Fhomes&section_offset=7&query=Copenhagen&items_offset=36&allow_override%5B%5D=&title_type=HOMES_WITH_LOCATION&click_referer=t%3ASEE_ALL%7Csid%3A9ea0a18e-f8e0-4eec-8840-b5a4290dfd22%7Cst%3ASTOREFRONT_DESTINATION_GROUPINGS&s_tag=UrkEXloL&_set_bev_on_new_domain=1600107037_MfmtIRDZJZFwrMs0';

scrapeHomeInIndexPage('https://hr.airbnb.com/s/Copenhagen/homes?refinement_paths%5B%5D=%2Fhomes&section_offset=7&query=Copenhagen&items_offset=36&allow_override%5B%5D=&title_type=HOMES_WITH_LOCATION&click_referer=t%3ASEE_ALL%7Csid%3A9ea0a18e-f8e0-4eec-8840-b5a4290dfd22%7Cst%3ASTOREFRONT_DESTINATION_GROUPINGS&s_tag=UrkEXloL&_set_bev_on_new_domain=1600107037_MfmtIRDZJZFwrMs0');