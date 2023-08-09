//---FINISHED---//

function handlePrice(price){
  //adds correct price 
  let np = price.split("Discounted from");
  //discounted from indicates that there is an aftermarket discount on nike

  if(np.length === 1){
    return checkString(np[0]) + ".00";
  }
  //assuming there was no delimeter, add normal msrp

  return checkstring(np[1]) + ".00";
  //add msrp and accordingly
};

async function processUrl(url) {
  const axios = require('axios');
  const cheerio = require('cheerio');
  const { getAltImage } = require('./getAltImage');

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    //load cheerio data

    const title = checkString($('h1.headline-2').text());
    //grabs title

    const description = $('div.description-preview.body-2.css-1pbvugb').find('p').text();
    //grabs description

    const price = handlePrice($('.product-price').text());
    //grabs price

    let oneColor = true;
    let htmls = [];
    //for images

    const elements = $('div.css-b8rwz8.tooltip-component-container'); 
    // select all div elements with the class "css-b8rwz8 tooltip-component-container"

    elements.each((index, element) => {
      oneColor = false;
      retHtml = $(element).html().toString(); // log the HTML code of each selected element to the console
      htmls.push(retHtml);
    });
    //if elements of this type exist, it suggests that colorways exist for the shoe, in which it will turn "oneColor" false
    
    let variants = {};
    if(oneColor){
      let image = '';
      $('img.css-viwop1').each((index, element) => {
        if(index === 1){
          image = $(element).attr('src');
        }
      });
      let colorway = $('.description-preview__color-description').text();
      colorway = colorway.slice(colorway.indexOf(": ")+2, colorway.length);
      variants[colorway] = {
        'image': image
      }
    //assuming there is one color, this function will grab the standard side shoe profile as the website directs
    }
    else{
        variants = await getAltImage(htmls);
    }
    //assuming multiple colorways, references external function to grab all other colorway photos

    return {
      'brand': 'nike',
      'title': title,
      'url': url,
      'category': 'shoes',
      'description': description,
      'price': price,
      'variants': variants,
    };
  } 
  catch (error) {
    return {
      'brand': 'nike',
      'title': null,
      'url': url,
      'category': '',
      'description': '',
      'image_ref': '',
      'price': ''
    };
  }
}

module.exports.processUrl = processUrl;

function checkString(str){
  const midpoint = Math.floor(str.length / 2);

  // Split the string into two parts using the midpoint
  const firstHalf = str.slice(0, midpoint);
  const secondHalf = str.slice(midpoint);

  if(firstHalf === secondHalf){
    return firstHalf;
  }
  else{
    return str;
  }
}

async function testing() {
  let data = await processUrl('https://www.nike.com/t/air-max-97-mens-shoes-LJmK45/921826-101');
  //console.log(test);
  console.log(data);
}

testing();

