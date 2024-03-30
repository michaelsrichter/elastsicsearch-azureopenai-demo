const fs = require("fs");
const csv = require("csv-parser");
const createEmbedding = require("./createEmbeddingsAzure");
const dataProcessing = require("./dataProcessing");
const path = require("path");
const { addRecord, createIndex } = require("./elasticsearch");
const async = require('async');

const indexName = process.argv[2];
const dateFileName = process.argv[3];

const tempFilePath = path.join(__dirname, "temp", `${indexName}.txt`); // this is used to keep track of the event_ids that have been processed, so that we don't process them again
// Create the temp directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, "temp"))) {
  fs.mkdirSync(path.join(__dirname, "temp"));
}
// Check if the file exists
if (!fs.existsSync(tempFilePath)) {
  // If the file doesn't exist, create it
  fs.writeFileSync(tempFilePath, "");
}

// Load the event_ids from the file
let eventIds = fs.readFileSync(tempFilePath, "utf-8").split("\n");

// Remove the last element if it's an empty string (which happens if the file ends with a newline)
if (eventIds[eventIds.length - 1] === "") {
  eventIds.pop();
}

//try createIndex, catch log any errors, and continue
async function initializeIndex() {
  try {
    await createIndex(indexName);
  } catch (error) {
    console.log(error);
  }
}

async function processFile() {
  await initializeIndex();
  const results = [];
  fs.createReadStream(dateFileName)
    .pipe(csv())
    .on("data", async (data) => {
      results.push(data);
    })
    .on("end", async () => {
      async.eachSeries(results, async (data) => {
        if (eventIds.includes(data.event_id)) {
          console.log(`Skipping event_id ${data.event_id}`);
          return;
        }

        if (data.snippet) {
          // Convert the date string to a Date object
          const eventDate = new Date(data.date);
          // Only process records from 2017 or later
          if (eventDate.getFullYear() >= 2017) {
            data.content = dataProcessing.generateContent(data);
            data.contentHtml = dataProcessing.generateContentHTML(data);

            const embedding = await createEmbedding.createEmbedding(data);
            console.log(`Embedding created for event_id ${data.event_id}`);
            // Add the embedding to the data
            data.embedding = embedding.data[0].embedding;

            // Convert the Date object back to a string for Elasticsearch
            data.date = eventDate.toISOString();
            console.log(`Processing event_id ${data.event_id}`);
            await addRecord(data, indexName).catch(console.log);

            // Append the event_id to the list
            fs.appendFile(tempFilePath, `${data.event_id}\n`, (err) => {
              if (err) {
                console.error(`Failed to append event_id to file: ${err}`);
              }
            });
          }
        }
      });
    });
}
processFile();
