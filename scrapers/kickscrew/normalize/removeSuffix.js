const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile); // Add this line to promisify fs.writeFile


async function removeSuffix() {
    const directoryPath = path.join(__dirname, 'prefix_items');
    const files = await readdir(directoryPath);

    for (let file of files) {
        const filePath = path.join(directoryPath, file);
        const brand = path.basename(file, '.json'); // Assume the file name (without .json) is the brand

        try {
            const data = await readFile(filePath, 'utf-8');
            const objects = JSON.parse(data);

            const newObjects = await suffixAfterBrand(objects); // Change this line to store returned objects
            const newDirectoryPath = path.join(__dirname, 'suffix_items');
            await writeFile(path.join(newDirectoryPath, `${brand}.json`), JSON.stringify(newObjects, null, 2)); // Write new objects to file

            } catch (err) {
            console.log('Error reading or processing file:', err);
        }
    }
}

const suffixAfterBrand = async (objects) => { // Make this function async
    const newObjects = []; // create an array to collect new objects


    for(let object of objects) {
        let title = object.title.split(" ");
        title = title.splice(0, title.length -1).join(" ").trim();

        object.title = title;
        newObjects.push(object);
    }
    return newObjects; // return new objects
}

removeSuffix();
