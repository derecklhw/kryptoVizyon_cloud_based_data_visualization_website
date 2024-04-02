import { WriteRequest } from 'aws-sdk/clients/dynamodb';
import process from 'node:process';
import { getNewsData } from './text-data';
import { getNumericalData } from './numerical-data';

const getThirdPartyData = async (table: string) => {
    if (!table) throw new Error('No table provided');
    if (table !== "numerical" && table !== "text") throw new Error('Invalid table type');

    try {
        const symbols: string[] = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE'];
        const batchWriteLimit = 25;

        const data: WriteRequest[] = [];

        for (const symbol of symbols) {
            const requestData: any = table === 'numerical' ? await getNumericalData(symbol) : await getNewsData(symbol);
            data.push(...requestData);
        }

        console.log(data.length);

    } catch (error) {
        throw error;
    }
}

getThirdPartyData(process.argv[2])

