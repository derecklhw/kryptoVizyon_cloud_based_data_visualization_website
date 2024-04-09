import axios from 'axios';
import dotenv from 'dotenv';
import { NewsResponse, News } from './types';
import { WriteRequest } from '@aws-sdk/client-dynamodb';
import { v4 } from 'uuid';

dotenv.config();

const newsApiKey = process.env.NEWS_API_KEY;
const QUERY_LIMIT = 50;

/*
* This function retrieves news data for a given symbol
* @param {string} symbol - The symbol to retrieve news data for
* @returns {Promise<WriteRequest[]>} - An array of WriteRequest objects
*/
export const getNewsData = async (symbol : string) : Promise<WriteRequest[]> => {
    const apiUrl : string = `https://newsapi.org/v2/everything?q=${symbol}&sortBy=relevancy&apiKey=${newsApiKey}&language=en`
    try {
        // Fetch data from the API
        const response = await axios.get(apiUrl);
        const data : NewsResponse = response.data;
        // If there is no data, return an empty array
        if ( !data.articles || data.articles.length === 0) return [];  
        // Limit the number of articles to QUERY_LIMIT     
        data.articles = data.articles.slice(0, QUERY_LIMIT);
        // Preprocess and return the data
        return preprocess(data.articles, symbol);
    }
    catch (error) {
        throw new Error('Failed to fetch news data');
    }
}

/*
* This function preprocesses the data retrieved from the API
* @param {News[]} articles - The data retrieved from the API
* @param {string} symbol - The symbol of the cryptocurrency
* @returns {WriteRequest[]} - An array of WriteRequest objects
*/
const preprocess = (articles: News[], symbol: string) : WriteRequest[] => {
    return articles.map(article => {
        return {
            PutRequest: {
                Item: {
                    'id': { S: v4()},
                    'timestamp': { N: new Date(article.publishedAt).getTime().toString() },
                    'symbol': { S: symbol },
                    'title': { S: article.title },
                }
            }
        }
    });
}


