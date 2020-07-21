const request = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");

async function main () {
    const html = await request.get("https://reactnativetutorial.net/css-selectors/lesson2.html");
    //fs.writeFileSync("./test.html", html);
    const $ = await cheerio.load(html);
   // const theText = $("h1").text();

   $("h2").each((index,element) => {
        console.log($(element).text());
   });
    
}

main();