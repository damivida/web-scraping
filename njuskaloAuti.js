const request = require("request-promise");
const cheerio = require("cheerio");

const url = 'https://www.njuskalo.hr/auti/kia-ceed?price%5Bmin%5D=7000&price%5Bmax%5D=12000';

const scraperTestObj = {
    title: ''
}

const carsInfo = []

async function scrapeNjuskalo() {

    try {
        const htmlResult = await request.get(url);
        const $ = cheerio.load(htmlResult);

        $('.entity-body').each((index, element) => {
            const carName = $(element).children('.entity-title').children('.link').text();
            const carSpec = $(element).find('.entity-description-main').text();

           

            const carInfo = {carName,carSpec};

            carsInfo.push(carInfo);
        })

        console.log(carsInfo);

    }catch(err) {
        console.log(err);
    }
}


scrapeNjuskalo();