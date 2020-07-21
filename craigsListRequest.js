const request = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");

const url = 'https://sfbay.craigslist.org/d/software-qa-dba-etc/search/sof';

const scrapeResultTest = {
    title: 'AR/VR Apps Review Specialist',
    description: 'HireArt is helping our client, an Innovative VR company,...',
    datePosted: new Date('2020-07-09'),
    url: 'https://sfbay.craigslist.org/pen/sof/d/menlo-park-ar-vr-apps-review-specialist/7155046218.html',
    hood: 'menlo park',
    address: 'San Mateo Drive',
    compensation: '$35 - $40/hour'
}

const scrapeResults = [];

//getting heders
async function scrapeJobHeader()  {    
    try{
        const htmlResult = await request.get(url);
        const $ = cheerio.load(htmlResult);

        $('.result-info').each((index,element) => {
            const resultTitle =  $(element).children('.result-title');
            const title = resultTitle.text();
            const url = resultTitle.attr('href');
            const datePosted = new Date($(element).children('time').attr('datetime'));
            const hood = $(element).find('.result-hood').text();

            const scrapeResult = {title, url, datePosted, hood};
            scrapeResults.push(scrapeResult);

          });

          //console.log(scrapeResults);
          return scrapeResults;
          

    }catch (err) {
        console.log(err);
    }
}

//iterate throught the  array of jobs and find url with the description of each job, set new property to an object
async function scrapeDescription(jobsWitHeaders) {
   return await Promise.all(
       jobsWitHeaders.map(async element => {
           try {
            const htmlResult = await request.get(element.url);
            const $ = await cheerio.load(htmlResult);
            $('.print-qrcode-label').remove();
            element.description = $('#postingbody').text();
            //job.address 
            const compensationText = $('.attrgroup').children().first().text();
            element.compensation = compensationText.replace('compensation:', '');
            return element;
           }catch(err) {
            console.log(err);
           }

        })
    );
}



//getting all data
async function scrapeCraigslist() {
    const jobsWitHeaders = await scrapeJobHeader();
    const jobsFullData = await scrapeDescription(jobsWitHeaders);
    console.log(jobsFullData);
}

scrapeCraigslist()
//scrapeJobHeader();

