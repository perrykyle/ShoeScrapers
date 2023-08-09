const fs = require('fs').promises;
const path = require('path');
const urlModule = require('url');

/*
  getPrices.js returns array of all prices for listed URLs 

  In order for a URL to be checked for its price, there must be an existing price scraper in "scrapers" directory
  The scraper in the directory must be "hostnamePrice.js"

  A "www.nike.com" url will coorespond to a "nikePrice.js" scraper
  
  Incoming price scrapers must return price in the correct format: $1,234.00 $12.34, etc.
  
  Function is created to handle incoming price scrapers automatically
  URL's including hostnames that don't have a matching scraper will be ignored
*/ 


const getPrices = async (filename) => {
  // Read the filenames in the "scrapers" directory
  // Incoming files should be named "<hostname>Price.js"
  const filenames = await fs.readdir(path.join(__dirname, 'scrapers'));
  

  // Import all scraper functions from 'scrapers' folder
  // Stores functions by file name in Scrapers object
  const scrapers = {};
  for (let filename of filenames) {
    const scraperName = path.basename(filename, '.js');
    scrapers[scraperName] = require(`./scrapers/${scraperName}`);
  }

  // Read the file containing the URLs
  const links = await fs.readFile(filename, 'utf-8');
  const urls = links.split('\n');

  const prices = [];

  for (let url of urls) {
    // Grabs hostname from url (e.g. www.nike.com)
    const hostname = new urlModule.URL(url).hostname;

    // Find the scraper that matches the hostname
    for (let scraperName in scrapers) {
      siteName = scraperName.replace('Price', '').toLowerCase();

      // Checks if the URL contains the siteName in each scraper
      if (hostname.includes(siteName)) {

        // Grabs price by calling the specific scraper based on the URL hostname
        const price = await scrapers[scraperName](url);

        if (price !== null) {
          prices.push(price);
        }
        break;
      }
    }
  }

  console.log(prices);
  console.log('length', prices.length);
  
  return(prices);
};

// Pulls from prices located in "links.txt" in same directory, can be altered for any impelementation
getPrices('links.txt').catch(err => console.error(err));
