const fs = require("fs");
const csv = require("csv-parser");
const OpenAI = require("openai");
const { addRecord, createIndex } = require("./elasticsearch");

createIndex().catch(console.log);

const openai = new OpenAI({
  apiKey: "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",
});
const results = [];
let lineCount = 0;

const stream = fs
  .createReadStream("data/nyc-park-events.csv")
  .pipe(csv())
  .on("data", async (data) => {
    // Check if the line has a location and a snippet
    if (data.location_description && data.snippet) {
      // Convert the date string to a Date object
      const eventDate = new Date(data.date);
      // Only process records from 2017 or later
      if (eventDate.getFullYear() >= 2017) {
            // Update the snippet field
        data.snippet = `On ${data.date} at ${data.start_time}, ${data.snippet}`;

        const embbedding = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: data.snippet,
          encoding_format: "float",
        });

        // Add the embedding to the data
        data.embedding = embbedding.data[0].embedding;

        // Convert the Date object back to a string for Elasticsearch
        data.date = eventDate.toISOString();

        addRecord(data).catch(console.log);
        results.push(data);
        //lineCount++;

        if (lineCount === 10) {
          stream.destroy();
          console.log(results);
        }
      }
    }
  });
