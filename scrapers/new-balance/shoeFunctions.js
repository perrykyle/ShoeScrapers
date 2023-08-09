const cheerio = require('cheerio');

// FOR PRICE FORMATTING ONLY, NOT EXPORTED. CALLED IN GETPRICE FUNCTION
function extractFirstPrice(input) {
  const regex = /\$\d{1,3}(,\d{3})*(\.\d+)?/; // Regular expression to match the price format
  const match = input.match(regex); // Find the first match in the input string

  if (match) {
    return match[0]; // Return the matched price
  } else {
    return null; // Return an empty string if no price is found
  }
}
//FOR  DESCRIPTION FORMATTING ONLY, NOT EXPORTED, CALLED IN THE GETDESCRIPTION FUNCTION
function truncateDesc(inputString) {
  const descriptionPrefix = "\n";
  const startIndex = inputString.lastIndexOf(descriptionPrefix);

  if (startIndex === -1) {
    // The prefix is not found, return the original string
    return inputString;
  }

  const truncatedString = inputString.substring(startIndex + descriptionPrefix.length);
  return truncatedString;
}



// Returns a link to the image for the shoe
function getImage(html) {
    if(html === null){
        return {};
    }
    const $ = cheerio.load(html);
    const divClass = '.carousel-item.zoom-image-js.active';

    // Find the 'div' with the class 'carousel-item zoom-image-js active'
    // and then find the 'source' tag within it with type attribute 'image/jpeg'
    let source = $(divClass).find('source[type="image/jpeg"]');

    // Extract the 'srcset' attribute, split it on ',' to get an array of URLs, 
    // and then split each URL on ' ' to separate the URL from the pixel density indicator.
    // Finally, decode the URI component to convert any special characters.
    let srcset = source.attr('srcset').split(',').map(url => decodeURIComponent(url.trim().split(' ')[0]));

    // Return the first URL from the array (should be the 1x version)
    return srcset[0];
}

// Returns the title of the shoe
function getTitle(html) {
  const $ = cheerio.load(html);
  const title = $('h1.product-name.hidden-sm-down').text().trim();
  return title;
}

// Returns the price of the shoe
function getPrice(html) {
  const $ = cheerio.load(html);
  const price = $('span.sales.font-body-large').text().trim();
  return extractFirstPrice(price.toString());
}

// Returns the description of the shoe
function getDescription(html) {
  const $ = cheerio.load(html);
  const description = $('div#collapsible-description-1').text().trim();
  return truncateDesc(description.toString());
}

// Returns the variant type of the shoe
function getVariant(html) {
  const $ = cheerio.load(html);
  const variant = $('span.display-color-name.color-name-desktop.font-body.regular').text().trim();
  return variant;
}

module.exports = {
  getTitle,
  getImage,
  getPrice,
  getDescription,
  getVariant,
};