//---FINISHED---//

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
//imports

async function scrollDownUntilBottom(url) {
  //async return function

  console.log('loading headless browser..');
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url);
  //initialize browser

  let previousHeight, previousLimit, currentHeight = 0;
  let numScrolls = 0;
  let scrollsInARow = 0;
  let scrollMult = 0;
  const baseScroll = .025;
  //variables needed

  while (scrollMult<1.25) {
    //while the scroll multiplier is less than 1.25

    console.log('previousLimit: ', previousLimit, " currentHeight: ", currentHeight);
    //displays the previous scroll limit and the current scroll limit

    if(currentHeight===previousLimit){
      scrollsInARow++;
    }
    //if the current scroll limit and the previous scroll limit are the same
    //--it means that if scrolling didn't trigger the update
    //increase scrolls in a row count
    
    else{
      //the page updated
      scrollsInARow = 0;
      //reset the scrolls in a row count to zero since it updates
    }

    previousHeight = await page.evaluate('window.scrollY');
    //previousHeight is the height that the scroll bar is currently at

    scrollMult = (baseScroll * scrollsInARow) + .85;
    //multiplies the baseScroll amount by the number of times it has scrolled since udpating

    previousLimit = await page.evaluate('document.body.scrollHeight');
    //changes the previous limit to the scroll limit that exists before the change

    console.log(previousHeight, " prev - curr ", currentHeight);
    console.log(scrollsInARow, " scrolls - mult ", scrollMult);
    //prints debugging information
    //the current scroll height and the current scroll limit
    //the amount of scrolls in a row and the current scroll multiplier

    await page.waitForTimeout(500); 
    //waits for .5 seconds to load new content

    await page.evaluate('window.scrollTo(0, document.body.scrollHeight * ' + scrollMult.toString() + " )");
    //scrolls down to the max scroll height * the scroll multiplier
  
    currentHeight = await page.evaluate('document.body.scrollHeight');
    //takes the new scroll limit and adds it to currentHeight

    numScrolls++;
    console.log(`Scrolled ${numScrolls} times`);
    //increases scroll count and logs the scroll number
  }

  const html = await page.content();
  const $ = cheerio.load(html);
  //load items into cheerio

  const urls = [];
  const names = [];
  const items = $('[data-testid="product-card__link-overlay"]');
  //creates needed arrays for each piece of data 

  let result = {};
  items.each((i, item) => {
    result[($(item).text().trim())] = $(item).attr('href');
  });
  //maps each item by name and url

  await browser.close();
  //closes browser
  return result;
  //ret
}

module.exports = {scrollDownUntilBottom};