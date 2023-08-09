// Returns information regarding an item using cheerio and axios
const axios = require('axios');
const cheerio = require('cheerio');

// Price formatting 
function extractPrice(input) {
    const regex = /US\$(\d{1,3}(,\d{3})?)/; // Regular expression to match the price format
    const match = input.match(regex); // Find the first match in the input string
  
    if (match) {
      return '$' + match[1]; // Return the matched price with the dollar sign
    } else {
      return null; // Return an empty string if no price is found
    }
}

// User Agent Header for scraper protection
const getUserAgentHeader = () => {
    const browser = 'Mozilla/5.0'; // Common web browser user agent
    const platform = process.platform;
    const platformDetails = {
      win32: 'Windows NT 10.0; Win64',
      darwin: 'Macintosh; Intel Mac OS X 10_15_7',
      linux: 'X11; Linux x86_64'
    };
    const platformInfo = platformDetails[platform] || platform;
  
    return `${browser} (${platformInfo})`;
};

// Gathers and returns the HTML
const fetchData = async (url) => {  
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': getUserAgentHeader()
        }
      });
  
      // Process the response data
      return response.data;
    } catch (error) {
      // Handle any errors
      return null;
    }
};

// Processes html and returns title
function getTitle(html) {
    const $ = cheerio.load(html);
    const title = $('.product-area__details__title.product-detail__gap-sm.h2').text() || '';
    return title.trim();
}

// Processes html and returns category
function getCategory(html) {
    const $ = cheerio.load(html);
    const category = $('.type').text() || '';
    return category.trim();
}

// Processes html and returns price
function getPrice(html) {
    const $ = cheerio.load(html);
    const price = $('.current-price.theme-money').text() || '';
    return extractPrice(price.trim().toString());
}

// Processes html and returns description
function getDescription(html) {
    const $ = cheerio.load(html);
    let description = '';
    $('.cc-tabs__tab').each(function () {
        const h2Text = $(this).find('h2').text().trim();
        if (h2Text === 'Description') {
            description = $(this).find('.cc-tabs__tab__panel.rte[role="tab"]').text().trim();
        }
    });
    return description;
}

// Processes html and returns colorway
function getColorway(html) {
    const $ = cheerio.load(html);
    let colorway = '';
    $('.pdp-product-info-col').each(function () {
        const h3Text = $(this).find('h3').text().trim();
        if (h3Text.toLowerCase() === 'color way') {
            colorway = $(this).find('.pdp-body-text').text().trim();
        }
    });
    return colorway || '';
}

// Processes html and returns image href
function getImage(html) {
    const $ = cheerio.load(html);
    const imageSrc = $('.rimage__image').attr('src') || '';
    return imageSrc ? 'https:' + imageSrc : '';
}

// Gathers HTML, returns base schema for product provided
async function getProduct(url){
    html = await fetchData(url);
    if(html === null){
        return null;
    }

    let temp = {};
    temp[getColorway(html)] = {"image": getImage(html)};

    return{
        "brand": "",
        "title": getTitle(html),
        "url": url,
        "category": getCategory(html),
        "description": getDescription(html),
        "price": getPrice(html),
        "variants": temp
    }
}

module.exports = getProduct;
