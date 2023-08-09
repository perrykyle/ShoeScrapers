// gathers and returns a list of all of the product URL's along with their different colorways

const puppeteer = require('puppeteer');

// sleep function to help load items
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// main getUrls function
async function getUrls() {

    // puppeteer loading browser
    console.log('Initializing headless browser...');
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.newbalance.com/men/shoes/all-shoes/?ecid=ps_Google_new+balance+mens+shoes_e_17507855184_1161&gclid=CjwKCAjw04yjBhApEiwAJcvNoXPirh5YPhLlgOVmaqh7rIJ_DOIVykOaO65icdmQKf0iXbxxuK12IhoCQykQAvD_BwE&gclsrc=aw.ds', {waitUntil: 'networkidle2'});

    console.log('Browser loaded');

    let loadMoreButtonExists = await page.$('#btn-loadMore') !== null;

    while(loadMoreButtonExists) {
        await page.click('#btn-loadMore');
        await sleep(1000);

        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');

        let productsViewed = await page.$eval('.products-viewed', element => element.textContent);
        console.log(productsViewed.trim());

        await sleep(1000);

        loadMoreButtonExists = await page.$('#btn-loadMore') !== null;
    }

    let hrefs = await page.evaluate(() => {
        let results = [];
        let items = document.querySelectorAll('.slick-track');
        items.forEach((item) => {
            let subArray = [];
            let links = item.getElementsByTagName('a');
            for(let link of links) {
                subArray.push(link.href);
            }
            results.push(subArray);
        });
        return results;
    });

    await browser.close();
    return hrefs;
}

module.exports = getUrls;

//getUrls().then(result => {console.log(result);});