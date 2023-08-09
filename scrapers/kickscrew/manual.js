// Manual processing of brands
// node manual.js "<brand name>"
// Include quotations, case match brand name as in brands.json directly
const processBrand = require('./processBrand');
const fs = require('fs');

const brand = process.argv.slice(2)[0];

const brandsData = fs.readFileSync('./brands.json', 'utf8');
const brandsObject = JSON.parse(brandsData);

let url = brandsObject[brand];

const manualProcess = async(brand, url) => {
    await processBrand(brand, url);
}

manualProcess(brand, url);