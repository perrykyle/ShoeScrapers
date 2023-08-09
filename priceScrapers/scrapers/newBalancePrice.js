const cheerio = require('cheerio');
const axios = require('axios');

function extractFirstPrice(input) {
    const regex = /\$\d{1,3}(,\d{3})*(\.\d+)?/; // Regular expression to match the price format
    const match = input.match(regex); // Find the first match in the input string
  
    if (match) {
      return match[0]; // Return the matched price
    } else {
      return null; // Return an empty string if no price is found
    }
}


const newBalancePrice = async (url) => {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
      });
  
      const $ = cheerio.load(response.data);
      const priceElement = $('span.sales.font-body-large');
  
      if(priceElement.length) {
        return extractFirstPrice(priceElement.text());
      } else {
        return null;
      }
  
    } catch (error) {
      console.error(`Error: ${error}`);
    }
};

module.exports = newBalancePrice;