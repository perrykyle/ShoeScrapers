const axios = require('axios');
const functions = require('./shoeFunctions');
const getUrls = require('./getUrls');
const toJSON = require('./toJSON');

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
      console.error(error);
    }
};


// Returns the full schema from the original colorway
getFullSchema = (html) => {
    image = functions.getImage(html);
    title = functions.getTitle(html);
    price = functions.getPrice(html);
    description = functions.getDescription(html);
    variant = functions.getVariant(html);

    let temp = {};
    temp[variant] = {"image": image};

    return {
        "brand": "new balance",
        "title": title,
        "url": '',
        "category": "shoes",
        "description": description,
        "price": price,
        "variants": temp
    }
}

// Returns the variant schema from the follow-up colorways
getVariantSchema = (html) => {
    image = functions.getImage(html);
    variant = functions.getVariant(html);
    return [variant, {"image": image}];
}


// Processes the full list of URLs pulled from getUrls.js
// getUrls passes an array of arrays each consisting of different colorways (if they exist) for each shoe. 
// 
// In processUrls, I gather all of the URLs, then I use one of the URLs in each shoe array to gather the full description
// After this, I process each remaining link for their colorway variant and image. Then, I add them to the product, add the product to the -
// list, and then return the list consisting of an array of objects(shoes), with the correct information.
async function processUrls(){
    allUrls = await getUrls();
    products = [];

    let i = 0;
    for(let urls of allUrls){
        // Grabs the entire object from the first colorway in the array, adds URL
        product = getFullSchema(await fetchData(urls[0]));
        product.url = urls[0];

        // For each follow-up colorway, get the variant and image link from each one and add it to the object created previously with full info
        for(let i = 1; i < urls.length; i++){
            variant = getVariantSchema(await fetchData(urls[i]));
            product.variants[variant[0]] = variant[1];
        }

        // Push product
        products.push(product);
        console.log(`Processed ${++i} shoes: ${product.title}`)
        console.log(product);
    }
    
    return products;
}

processUrls();