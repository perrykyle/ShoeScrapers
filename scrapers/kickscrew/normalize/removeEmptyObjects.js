// Removes out of stock or empty objects from object arrays in each file under "items"
const fs = require('fs');
const path = require('path');

function removeEmptyObjects() {
  // Path to the items directory
  const itemsDir = path.join(__dirname, 'items');

  // Path to the new items directory
  const newItemsDir = path.join(__dirname, 'new_items');

  // Create the new_items directory if it doesn't exist
  if (!fs.existsSync(newItemsDir)) {
    fs.mkdirSync(newItemsDir);
  }

  // Read all files in the items directory
  fs.readdir(itemsDir, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      return;
    }

    // Iterate over each file
    files.forEach(file => {
      // Only process json files
      if (path.extname(file) === '.json') {
        const filePath = path.join(itemsDir, file);

        // Read the file
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading file ${file}: ${err}`);
            return;
          }

          let items;
          try {
            items = JSON.parse(data);
          } catch (e) {
            console.error(`Error parsing file ${file}: ${e}`);
            return;
          }

          // Filter out items with a null, undefined, or empty price
          const validItems = items.filter(item => item.price && item.price.trim() !== '');

          // Write the valid items back to a file in the new_items directory
          const newFilePath = path.join(newItemsDir, file);
          fs.writeFile(newFilePath, JSON.stringify(validItems, null, 2), 'utf8', (err) => {
            if (err) {
              console.error(`Error writing file ${newFilePath}: ${err}`);
            } else {
              console.log(`Filtered items written to ${newFilePath}`);
            }
          });
        });
      }
    });
  });
}

removeEmptyObjects();

// Export the function
module.exports = removeEmptyObjects;
