// Finds all prefixes preceding brand titles within the name, 
// prints titles with no brand name included

// Writes all prefixes to "title.json"
// Used as a preliminary prefix eyeballer, will help score audience in new JSON
const fs = require('fs');
const path = require('path');
const util = require('util');
const readline = require('readline');

const readFile = util.promisify(fs.readFile);

// Variableto assist user Input recognition
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to await user input between brand prefix processing
// Helps to constantly look at title.json to see live updates
async function askQuestion(query) {
    return new Promise(resolve =>
        rl.question(query, ans => {
            rl.close();
            resolve(ans);
        })
    );
}

// Gathers brand Names
async function readTitleJSON() {
    const titleJSONPath = path.join(__dirname, 'title.json');
    const data = await readFile(titleJSONPath, 'utf-8');
    const titleJSON = JSON.parse(data);

    for (let brand in titleJSON) {
        await readFileInFolder(brand);
        await askQuestion(`Press Enter to continue with the next brand...`);
        rl = readline.createInterface({ input: process.stdin, output: process.stdout }); // recreate readline interface as it's closed after each question
    }
}

// Reads the file in the folder based on the passed brand
// Called from readTitleJSON()
async function readFileInFolder(brand) {
    const directoryPath = path.join(__dirname, 'new_items');
    const filePath = path.join(directoryPath, `${brand}.json`);

    try {
        const data = await readFile(filePath, 'utf-8');
        const objects = JSON.parse(data);
        normalize(objects, brand);
    } catch (err) {
        console.log('Error reading file:', err);
    }
}

// Pushes prefixes to the prefixes array
/*

TODO: Reimplement a variation of this function in another file which accomplishes the following:
    - Sorts through each object in the brand
    - Finds all instances of values in "prefixes.json"
    - If it finds a value from "prefixes.json", sets "target" key in object to the value's key
    - Removes prefix from title, as well as any trailing spaces

*/
const prefixPriorToBrand = (objects, brand) => {
    const brandWords = brand.toLowerCase().split(' '); // split the brand into words
    const prefixes = []; // create an array to collect all prefixes

    for(let object of objects) {
        const title = object.title.toLowerCase(); // convert title to lowercase

        // find the first occurrence of any word from the brand in the title
        let firstOccurrenceIndex = title.length;
        for(let word of brandWords) {
            const wordIndex = title.indexOf(word);
            if(wordIndex !== -1 && wordIndex < firstOccurrenceIndex) {
                firstOccurrenceIndex = wordIndex;
            }
        }

        if (firstOccurrenceIndex !== title.length) {
            const prefix = object.title.slice(0, firstOccurrenceIndex);
            prefixes.push(prefix);
        } else {
            console.log(object.title);
        }
    }
    return prefixes;
}

// Adds array to the brands arrays based on brand name and array type, "prefix" in this case
function addArray(array, brand, type) {
    const filePath = path.join(__dirname, 'title.json'); // path to the file

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.log('Error reading file:', err);
        } else {
            try {
                const jsonData = JSON.parse(data); // parse the file content to a JavaScript object

                if(jsonData[brand] && Array.isArray(jsonData[brand][type])) { // check if the brand and type array exist
                    // add the array items that don't exist yet
                    array.forEach(item => {
                        if (!jsonData[brand][type].includes(item)) {
                            jsonData[brand][type].push(item);
                        }
                    });

                    const updatedData = JSON.stringify(jsonData, null, 2); // convert the updated object back to a JSON string

                    // write the updated JSON string back to the file
                    fs.writeFile(filePath, updatedData, 'utf-8', err => {
                        if (err) {
                            console.log('Error writing file:', err);
                        }
                    });
                } else {
                    console.log(`Brand or ${type} array not found.`);
                }
            } catch (err) {
                console.log('Error parsing JSON string:', err);
            }
        }
    });
}

// Organizing function that gets called from readTitleJSON()
const normalize = (objects, brand) => {
    console.log(objects.length, brand);
    const prefixes = prefixPriorToBrand(objects, brand);
    addArray(prefixes, brand, 'prefix');
}

readTitleJSON();