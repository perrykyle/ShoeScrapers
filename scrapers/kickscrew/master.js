// Reads "brands.json", parses the information and iterates through each brand
const fs = require('fs');
const processBrand = require('./processBrand');

const master = async() => {
  try {
    const brandsData = fs.readFileSync('./brands2.json', 'utf8');
    const brandsObject = JSON.parse(brandsData);

    for (const brand in brandsObject) {
      const url = brandsObject[brand];
      await processBrand(brand, url);
      console.log(`\n\n\n------------------------\n\n\nPROCESSED ${brand}\n\n\n------------------------\n\n\n`);
    }
  } catch (error) {
    console.error('Error reading or parsing "brands.json" file:', error);
  }
}

// Call the master function to start the processing
master();
