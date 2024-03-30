require("dotenv").config();

const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: process.env.ELASTICSEARCH_NODE,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY,
  },
});

async function createIndex(indexName) {
  try {
    // Check if the index already exists
    const { body: indexExists } = await client.indices.exists({
      index: indexName,
    });

    if (!indexExists) {
      // If the index doesn't exist, create it
      await client.indices.create({
        index: indexName, //"nyc-events-embeddings",
        body: {
          mappings: {
            properties: {
              event_id: { type: "integer" },
              title: { type: "text" },
              content: { type: "text" },
              contentHtml: { type: "text" },
              date: { type: "date" },
              location_description: { type: "text" },
              snippet: { type: "text" },
              embedding: { type: "dense_vector", dims: 1536 }, // ada-002 model produces 1024-dimensional embeddings
            },
          },
        },
      });
      console.log(`Index ${indexName} created.`);
    } else {
      console.log(`Index ${indexName} already exists.`);
    }
  } catch (error) {
    console.error(`An error occurred while creating the index: ${error}`);
  }
}

async function addRecord(data, indexName) {
  await client.index({
    index: indexName, //"nyc-events-embeddings",
    id: data.event_id,
    document: data,
  });

  console.log("Record added successfully.");
}

module.exports = { createIndex, addRecord };
