// Recieves a brand and a URL from the JSON and iterates through each page until all objects are recieved,
// writes the objects to a json file with the brand name
const fs = require('fs');
const returnPage = require('./returnPage');
const getProduct = require('./getProduct');

// Writes the objects to the file based on the brand name (in JSON)
function writeObjectsToFile(objectsArray, fileName) {
  const filePath = `./items/${fileName}.json`;
  const jsonContent = JSON.stringify(objectsArray, null, 2);

  fs.writeFileSync(filePath, jsonContent);

  console.log(`Objects written to ${filePath}`);
}

// Writes the urls to the file based on the brand name (in JSON)
function writeHrefsToFile(hrefsArray, fileName) {
    const filePath = `./urls/${fileName}.json`;
    const jsonContent = JSON.stringify(hrefsArray, null, 2);
  
    fs.writeFileSync(filePath, jsonContent);
  
    console.log(`Objects written to ${filePath}`);
  }


const processBrand = async(brand, url) => {
    // Starting page and initializes objects
    let page = 1;
    let objects = [];
    let oldLength = 0;
    let hrefs = [];

    console.log(`\nProcessing ${brand}\n`);

    // Infinite loop
    while(1){
        // Gathers the links object from returnPage
        res = await returnPage(url, page);
        console.log(`\nReturned ${res.hrefs.length} items`);

        // For each URL returned
        for(let resUrl of res.hrefs){
            // Gather product and add it to the array
            product = await getProduct(resUrl);
            if(product !== null){
                console.log(product.title);

                product.brand = brand;
                objects.push(product);
                hrefs.push(resUrl)
            }
        }
        console.log(`Added ${objects.length-oldLength} objects\n`);
        oldLength = objects.length;
        
        // Break delimiter
        if(res.isLastPage){
            break;
        }

        // Increments page count
        page++;
    }
    // Logs objects and writes to file
    console.log(objects);
    console.log(objects.length);
    writeObjectsToFile(objects, brand);
    writeHrefsToFile(hrefs, brand);
}

module.exports = processBrand;


