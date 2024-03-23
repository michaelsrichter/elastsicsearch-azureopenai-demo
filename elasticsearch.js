const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: "https://79df44ca145e404a82aaf5a6c6228842.eastus.azure.elastic-cloud.com:443",
  auth: {
    apiKey: "VW05ZmFZNEJMQmFXcldoMWcyNy06ZWtGQkRlUFNSc2lPcWQ5bFhSWDhWUQ==",
  },
});
async function createIndex() {
  // Check if the index exists
  const { body: indexExists } = await client.indices.exists({
    index: "nyc-events-embeddings",
  });

  // If the index exists, delete it
  if (indexExists) {
    await client.indices.delete({
      index: "nyc-events-embeddings"
    });
    console.log("dropped existing index.");
  }
  await client.indices.create(
    {
      index: "nyc-events-embeddings",
      body: {
        mappings: {
          properties: {
            title: { type: "text" },
            date: { type: "date" },
            location_description: { type: "text" },
            snippet: { type: "text" },
            embedding: { type: "dense_vector", dims: 1536 }, // ada-002 model produces 1024-dimensional embeddings
          },
        },
      },
    },
    { ignore: [400] }
  );

  console.log("Index created successfully.");
}

async function addRecord(data) {
  await client.index({
    index: "nyc-events-embeddings",
    body: data,
  });

  console.log("Record added successfully.");
}

module.exports = { createIndex, addRecord };

//createIndex().catch(console.log);
