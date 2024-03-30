require("dotenv").config();
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");


// You will need to set these environment variables or edit the following values
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_KEY;

// The name of the model deployment
const deploymentName = "text-embedding-ada-002";

const MAX_RETRIES = 5; // Maximum number of retries

async function createEmbedding(data) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
      const embeddings = await client.getEmbeddings(deploymentName, data.content);
      return embeddings;
    } catch (error) {
      if (error.name === 'ConnectionError') {
        console.log('Connection error occurred. Retrying...');
        retries++;
      } else {
        // If it's not a ConnectionError, rethrow the error
        throw error;
      }
    }
  }
  throw new Error('Failed to create embedding after maximum retries');
}
module.exports = { createEmbedding };