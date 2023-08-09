## Normalizing KicksCrew Data

First, removeEmptyObjects.js will remove all the empty or out of stock items from the queue
- You may need to configure the source and destination of items

(OPTIONAL) gatherPrefixes.js will return a list of prefixes and save it to the brand array under title.json
- where you can decide if any prefixes are indicating of a target audience (Infants, women, etc)

Second, processPrefixes.js will remove all of the prefixes that are determined prefixes.json
- It will remove the prefixes from the title, trim the white space, and add the audience from prefixes to the object.
- If no audience is found, it will default to "Men's" (TEMPORARY)