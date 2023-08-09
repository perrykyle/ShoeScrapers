// --- function only used for initial upload --- //
const fs = require('fs');

function toJSON(products) {
    // Convert the products array to a JSON string
    const json = JSON.stringify(products, null, 2); // null and 2 are for formatting purposes

    // Write the JSON string to a file
    fs.writeFile('products.json', json, (err) => {
        if (err) {
            console.error('An error occurred:', err);
        } else {
            console.log('Successfully wrote products to products.json');
        }
    });
}

module.exports = toJSON;