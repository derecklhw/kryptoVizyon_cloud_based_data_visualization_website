import axios from 'axios';
import dotenv from 'dotenv';
import { CryptoData, HistoricalResponse } from './types';
import { WriteRequest } from '@aws-sdk/client-dynamodb';
import { v4 } from 'uuid';

dotenv.config();

const crypto_compare_api_key = process.env.CRYPTO_COMPARE_API_KEY;
const QUERY_LIMIT = 499;

export const getNumericalData = async (symbol : string) : Promise<WriteRequest[]> => {
    const apiUrl : string = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=USD&limit=${QUERY_LIMIT}&api_key=${crypto_compare_api_key}`
    try {
        const response = await axios.get(apiUrl);
        const data : HistoricalResponse = response.data.Data;
        if ( !data.Data || data.Data.length === 0) return [];
        return preprocess(data.Data, symbol);
    }
    catch (error) {
        throw new Error('Failed to fetch numerical data');
    }
}

const preprocess = (historicalData: CryptoData[], symbol: string) => {
    return historicalData.map(data => {
        return {
            PutRequest: {
                Item: {
                    'id': { S: v4()},
                    'timestamp': { N: data.time.toString() },
                    'symbol': { S: symbol },
                    'open': { N: data.open.toString() },
                    'high': { N: data.high.toString() },
                    'low': { N: data.low.toString() },
                    'close': { N: data.close.toString() }
                }
            }
        }
    });
}