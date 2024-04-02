import { WriteRequest } from 'aws-sdk/clients/dynamodb';
import axios from 'axios';
import dotenv from 'dotenv';
import { v4 } from 'uuid';
import { CryptocurrencyResponse, HistoricalData } from './types';

dotenv.config();

const crypto_compare_api_key = process.env.CRYPTO_COMPARE_API_KEY;
const QUERY_LIMIT = 500;

export const getNumericalData = async (symbol : string) : Promise<WriteRequest[]> => {
    const apiUrl = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=USD&limit=${QUERY_LIMIT}&api_key=${crypto_compare_api_key}`
    try {
        const response = await axios.get(apiUrl);
        const data : CryptocurrencyResponse = response.data.Data;
        if ( !data.Data || data.Data.length === 0) return [];
        return preprocess(data.Data, symbol);
    }
    catch (error) {
        console.log(error);
        throw new Error('Failed to fetch numerical data');
    }
}

const preprocess = (historicalData: HistoricalData[], symbol: string) => {
    return historicalData.map(data => {
        return {
            PutRequest: {
                Item: {
                    'id': { S: v4() },
                    'timestamp': { N: data.time.toString() },
                    'symbol': { S: symbol },
                    'high': { N: data.high.toString() },
                    'low': { N: data.low.toString() },
                    'open': { N: data.open.toString() },
                    'volumeFrom': { N: data.volumefrom.toString() },
                    'volumeTo': { N: data.volumeto.toString() },
                    'close': { N: data.close.toString() }
                }
            }
        }
    });
}