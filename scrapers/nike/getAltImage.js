//---FINISHED---//

async function getAltImage(htmls) {
    try    
        {   const axios = require('axios');
            const cheerio = require('cheerio');
            //imports

            let variants = {};
            //initialize

            for(const html of htmls){
                //for each html in the list

                const lastSlashIndex = html.indexOf(">");
                const baseUrl = html.substring(9, lastSlashIndex - 1);
                //truncates string to correct link

                const response = await axios.get(baseUrl);
                const $ = cheerio.load(response.data);
                //loads link


                let image = '';
                $('img.css-viwop1').each((index, element) => {
                    if(index === 1){
                        image = $(element).attr('src');
                    }
                });
                //grabs the quality shoe side profile from link

                let colorway = $('.description-preview__color-description').text();
                colorway = colorway.slice(colorway.indexOf(": ")+2, colorway.length);
                variants[colorway] = {
                    'image': image
                }
                //finds colorway and returns variants
            }
            return variants;
        }
    catch(error){
        console.log(error);
    }
}
//changes the url to the url with the new key

module.exports.getAltImage = getAltImage;