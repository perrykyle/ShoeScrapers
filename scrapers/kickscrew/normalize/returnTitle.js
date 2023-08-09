const fs = require('fs');
const util = require('util');
const path = require('path');

// Promisify fs.readFile for usage with async/await
const readFile = util.promisify(fs.readFile);

async function returnTitle(title) {
    // Read prefixes.json
    const data = await readFile(path.join(__dirname, 'prefixes.json'), 'utf8');
    const prefixes = JSON.parse(data);

    // Initialize categories array to collect keys of found prefixes
    let categories = [];

    // Iterate over each key in the prefixes object
    for (let category in prefixes) {
        // Iterate over each prefix under the current key
        for (let prefix of prefixes[category]) {
            // If the title contains the current prefix
            if (title.includes(prefix)) {
                // Add the category to the categories array, if it's not already added
                if (!categories.includes(category)) {
                    categories.push(category);
                }
                // Remove the prefix from the title
                // .trim() is used to remove any trailing or leading whitespace
                title = title.replace(prefix, '').trim();
            }
        }
    }
    // Return the new title and the categories
    return { title, categories };
}

module.exports = returnTitle;