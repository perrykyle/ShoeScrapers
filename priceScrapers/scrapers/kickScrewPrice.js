const cheerio = require('cheerio');
const axios = require('axios');

function extractPrice(input) {
    const regex = /US\$(\d{1,3}(,\d{3})?)/; // Regular expression to match the price format
    const match = input.match(regex); // Find the first match in the input string
  
    if (match) {
      return '$' + match[1]; // Return the matched price with the dollar sign
    } else {
      return null; // Return an empty string if no price is found
    }
}

const kickScrewPrice = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const priceElement = $('span.current-price.theme-money');

    if(priceElement.length) {
      return extractPrice(priceElement.text())+'.00';
    } else {
      return null;
    }

  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

module.exports = kickScrewPrice;