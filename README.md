# Elasticsearch and Azure OpenAI Integration Demo with NYC Parks Events

This project is a demonstration of the "On Your Data" integration between Elasticsearch and Azure OpenAI. It uses historical data from events happening in NYC parks to showcase the capabilities of this integration.

## Table of Contents

- [Introduction](#introduction)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Introduction

This repository contains the code needed for running a demo of the new [Elasticsearch support](https://www.elastic.co/search-labs/blog/azure-openai-on-your-data-Elasticsearch-vector-database) for the "On Your Data" feature of Azure OpenAI service. See the [announcement from Microsoft](https://techcommunity.microsoft.com/t5/ai-azure-ai-services-blog/azure-openai-service-expands-quot-on-your-data-quot-with/ba-p/4097023).

## Architecture

![Project Architecture](./NYC%20Park%20Events%20High%20Level%20Architecture.png)

## Installation

After cloning the repository, rename the `.env.sample` file to `.env` and update the values with your actual values from Azure OpenAI and Elasticsearch. 

## Usage

Run `npm install` and then `node index.js {index-name} {data-file-location}`

To use the sample NYC Park events data included from the [NYC Open Data](https://opendata.cityofnewyork.us/) site, just call

```
node index.js nyc-park-events-embeddings-index .\data\nyc-park-events-full.csv
```

The code will retrieve 16285 records of sample data from the csv file. It will take records of Park Events from 2017 and 2018. It will call Azure OpenAI to embed the NYC Park Event content and then push the record into Elasticsearch. 

The process may take about 20 minutes to complete.

## License

This project is licensed under the [MIT License](LICENSE).