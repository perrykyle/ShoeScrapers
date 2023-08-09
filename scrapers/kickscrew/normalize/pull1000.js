const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile); // Add this line to promisify fs.writeFile


async function pull1000() {
    const directoryPath = path.join(__dirname, 'prefix_items');
    const files = await readdir(directoryPath);

    let totalObjects = [];
    let items = [];

    for (let file of files) {
        const filePath = path.join(directoryPath, file);
        const brand = path.basename(file, '.json'); // Assume the file name (without .json) is the brand

        try {
            const data = await readFile(filePath, 'utf-8');
            totalObjects.push(JSON.parse(data));


            
            } catch (err) {
            console.log('Error reading or file:', err);
        }
    }

    for(let i = 0; items.length < 1000; ++i){
        console.log()
    }

    try{
        await writeFile(path.join(__dirname, `items1000.json`), JSON.stringify(items, null, 2)); // Write new objects to file
    } catch (err) {
        console.log('Error writing file:', err);
    }



}


removeSuffix();
