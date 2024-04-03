import axios from 'axios';
import dotenv from 'dotenv';
import { NewsResponse, News } from './types';
import { WriteRequest } from '@aws-sdk/client-dynamodb';

dotenv.config();

const newsApiKey = process.env.NEWS_API_KEY;
const QUERY_LIMIT = 50;

export const getNewsData = async (symbol : string) : Promise<WriteRequest[]> => {
    const apiUrl : string = `https://newsapi.org/v2/everything?q=${symbol}&sortBy=relevancy&apiKey=${newsApiKey}&language=en`
    try {
        const response = await axios.get(apiUrl);
        const data : NewsResponse = response.data;
        if ( !data.articles || data.articles.length === 0) return [];       
        data.articles = data.articles.slice(0, QUERY_LIMIT);
        return preprocess(data.articles, symbol);
    }
    catch (error) {
        throw new Error('Failed to fetch news data');
    }
}

const preprocess = (articles: News[], symbol: string) : WriteRequest[] => {
    return articles.map(article => {
        return {
            PutRequest: {
                Item: {
                    'timestamp': { N: new Date(article.publishedAt).getTime().toString() },
                    'symbol': { S: symbol },
                    'title': { S: article.title },
                }
            }
        }
    });
}


