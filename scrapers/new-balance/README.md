# New Balance

Collection of js files which pull from New Balance men's shoes

## Usage

Run the "processUrls.js" file. This will automatically pull all the New balance shoes from the [New Balance Men's Shoes](https://www.newbalance.com/men/shoes/all-shoes/?ecid=ps_Google_new+balance+mens+shoes_e_17507855184_1161&gclid=CjwKCAjw04yjBhApEiwAJcvNoTS0WNi_1gHBV8JHnDcRem9y1tbVb5_oyUA14H6JBJu7pEX2fh8qBhoCwV0QAvD_BwE&gclsrc=aw.ds&start=54&sz=18) catalog

## Output

processUrls.js will return an array of 'shoe' objects which can be described within the file itself.

## Notes

- New balance did not offer much scraper protection however I did need to use a user-agent header for axios
- This scraper went by much easier due to proper coding from the New Balance developers
- Functions are commented much clearer in these files, plus required much less code

## Files

- getUrls.js, retreives a list containing lists of shoes with their designated colorways in the same list
- processUrls.js, handles the URL list and pulls the information from each URL to match the schema
- shoeFunctions.js, contains functions used in processUrls.js, seperated for clarity
- toJSON.js, script using fs that creates a file in the same directory called "products.json"
- products.json, contains list of products created upon most recent use