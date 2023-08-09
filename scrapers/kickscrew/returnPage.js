// Takes a brand URL and a page number and pulls all of the items from that page along with a last page indicator
const request = require('request-promise');
const cheerio = require('cheerio');

// Scrapes the page based on the formatted URL and returns an object containing the URLs and a break point
const scrapeHtml = async(url) => {

    // Is error set to true to run initial loop, numTries to count amount attempts
    let isError = true;
    let numTries = 0;

    // While there were errors
    while(isError){
        try {
            // If the request is successful, we exit the loop
            data = await request(url);
            isError = false; 
        } catch (error) {
            // Increase try amount
            ++numTries;
            // If an error occurs, the loop continues until the request is successful
            console.error(`Scraper encountered error, Retrying...`);
            
            // If the number of tries reaches 10 (assuming its clipped or it didn't register the end of the page)
            if(numTries === 10){
                return {
                    "hrefs": [],
                    "isLastPage": true
                }
            }
        }
    }

    const $ = cheerio.load(data);
    let hrefs = [];

    // Grabs each URL for each shoe
    $('.ais-Hits-item a').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
            hrefs.push('https://www.kickscrew.com' + href.toString());
        }
    });



    // Checks if the "next" arrow is disabled, indicating that it is the last page.
    const element = $('li.ais-Pagination-item.ais-Pagination-item--nextPage.ais-Pagination-item--disabled span.ais-Pagination-link');
    if (element.length > 0) {
        return {
            "hrefs": hrefs,
            "isLastPage": true
        }
    } else {
        // Error occurs occasionaly beating the scraper, returning 0 items and damaging the program integrity
        // Countered through recursively calling api
        if(hrefs.length === 0){
            console.log('0 Links, Retrying API');
            return await scrapeHtml(url);
        }
        return {
            "hrefs": hrefs,
            "isLastPage": false
        }
    }
}

// Formats url for API and calls scrapeHtml, returning the data
const getData = async(brandUrl, page) => {
    //brandUrl = https://www.kickscrew.com/collection/<brand>
    //apiUrl(1) = https://www.kickscrew.com/collection/<brand>?hitsPerPage=32
    //apiUrl(>1) = https://www.kickscrew.com/collection/<brand>?page=<page#>&hitsPerPage=32

    // Choosing 32 items per page because the scraper protection on 64 items per page is intensive,
    // only guaranteeing scraping with the "ultra-premium" option which is 7.5x more expensive.

    // Ran into issues occasionally sraping the first page, so if it is the first page of a colleciton,
    // we use the regular "premium" tag to ensure that it comes through

    let formattedUrl = '';
    let isPremium = false;
    const api_key = "2d2fb78ccffef4fcb0f1e19981b29b24";

    // 1st Page recieves premium scraping permissions and doesn't include a page number
    if(page === 1){
        formattedUrl = `${brandUrl}?hitsPerPage=32`;
        isPremium = true;
    }
    else{
        formattedUrl = `${brandUrl}?page=${page}&hitsPerPage=32`
    }
    console.log('Processing ' + formattedUrl + '\n');

    // Formats API url and returns the scraped links and indicator if it is the last page in the collection
    const apiUrl = `http://api.scraperapi.com/?api_key=${api_key}&url=${encodeURIComponent(formattedUrl)}&render=true&premium=${isPremium}`;
    return await scrapeHtml(apiUrl);
}

module.exports = getData;
