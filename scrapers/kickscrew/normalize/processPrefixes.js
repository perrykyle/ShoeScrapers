const fs = require('fs');
const path = require('path');
const util = require('util');
const readline = require('readline');
const returnTitle = require('./returnTitle');

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile); // Add this line to promisify fs.writeFile

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askQuestion(query) {
    return new Promise(resolve =>
        rl.question(query, ans => {
            rl.close();
            resolve(ans);
        })
    );
}

async function processPrefixes() {
    const directoryPath = path.join(__dirname, 'new_items');
    const files = await readdir(directoryPath);

    for (let file of files) {
        const filePath = path.join(directoryPath, file);
        const brand = path.basename(file, '.json'); // Assume the file name (without .json) is the brand

        try {
            const data = await readFile(filePath, 'utf-8');
            const objects = JSON.parse(data);

            const newObjects = await prefixPriorToBrand(objects); // Change this line to store returned objects
            const newDirectoryPath = path.join(__dirname, 'prefix_items');
            await writeFile(path.join(newDirectoryPath, `${brand}.json`), JSON.stringify(newObjects, null, 2)); // Write new objects to file

            await askQuestion(`Press Enter to continue with the next file...`);
            rl = readline.createInterface({ input: process.stdin, output: process.stdout }); // recreate readline interface as it's closed after each question
        } catch (err) {
            console.log('Error reading or processing file:', err);
        }
    }
}

const prefixPriorToBrand = async (objects) => { // Make this function async
    const newObjects = []; // create an array to collect new objects

    for(let object of objects) {
        const result = await returnTitle(object.title); // Await the result of returnTitle
        // Create a new object with updated title and audience field, while keeping the other properties
        let categories = result.categories;
        if(categories.length === 0){
            categories = ["Men's"];
        }
        const newObject = {
            ...object,
            title: result.title,
            audience: categories
        };
        newObjects.push(newObject);
    }
    return newObjects; // return new objects
}

processPrefixes();
