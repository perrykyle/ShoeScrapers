//---FINISHED---//

//--- getUrls.js Srolls down the entire nike shoe list and collects the name and URL for each shoe ---//
//--- processUrls.js takes a url and will grab the information pertaining to the shoe listed in that url ---//
//--- getAltImage.js references the urls of the different colorways found for each shoe, travels to them and grabs their high quality side profile photos ---//
//--- master.js compiles them all together ---//
//--- processSchema.js adds the schema and downloads the images, stores in filesystem ---// - DEPRECATED


const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
// imports

(async () => {
    const { scrollDownUntilBottom } = require('./getUrls.js');
    //imports function
  
    const shoeUrl = 'https://www.nike.com/w/mens-shoes-nik1zy7ok';
    const result = await scrollDownUntilBottom(shoeUrl);
    //runs function

    console.log(`Returned ${Object.keys(result).length} items`);
    const { processUrl } = require('./processUrls');
    //imports

    const prop = [];
    let iterations = 0;
    const urls = Object.values(result);
    const postShoe = require('./postShoe').postShoe;
    for(const url of urls){
        //for each shoe urls
        let shoe = await processUrl(url);
        //grabs shoe schema from processUrl


        if(shoe.title !== null && typeof shoe.title !== undefined && shoe.title !== ''){
            console.log(shoe);
            iterations++;
           //print statements
            postShoe(JSON.stringify(shoe));
           //adds to fs

            console.log(`Processed ${iterations} shoes`);
            prop.push(shoe);

            if(iterations == 100){
                break;
            }
        }
    }
    
    return prop;
    
})();