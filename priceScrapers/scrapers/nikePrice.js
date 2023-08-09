const cheerio = require('cheerio');
const axios = require('axios');

const nikePrice = async (url) => {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      
      const firstElement = $('.product-price.is--current-price.css-s56yt7.css-xq7tty[data-test="product-price-reduced"]');
      const secondElement = $('.product-price.css-11s12ax.is--current-price.css-tpaepq[data-test="product-price"]');
      
      if(firstElement.length) {
        return firstElement.text();
      } else if(secondElement.length) {
        return secondElement.text();
      } else {
        return null;
      }
  
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

module.exports = nikePrice;