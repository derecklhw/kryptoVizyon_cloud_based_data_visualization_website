import { BatchWriteItemCommand, DynamoDBClient, WriteRequest } from '@aws-sdk/client-dynamodb';
import process from 'node:process';
import { getNewsData } from './text-data';
import { getNumericalData } from './numerical-data';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const getThirdPartyData = async (table: string) => {
    if (!table) throw new Error('No table provided');
    if (table !== "News" && table !== "Crypto") throw new Error('Invalid table type');

    try {
        const client = new DynamoDBClient({ region: 'us-east-1' })
        const docClient = DynamoDBDocumentClient.from(client);

        const symbols: string[] = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE'];
        const batchWriteLimit : number = 25;

        const dataChunks: WriteRequest[][] = [];
        let currentChunk: WriteRequest[] = [];

        for (const symbol of symbols) {
            const requestData = table === 'Crypto' ? await getNumericalData(symbol) : await getNewsData(symbol);
            requestData.forEach((item: WriteRequest) => {
                if (currentChunk.length >= batchWriteLimit) {
                    dataChunks.push(currentChunk);
                    currentChunk = [];
                }
                currentChunk.push(item);    
            });
        }

        if (currentChunk.length > 0) dataChunks.push(currentChunk);

        for (const chunk of dataChunks) {
            const putRequests = chunk.map((item: WriteRequest) => (
                {
                    PutRequest: {
                        Item: item.PutRequest!.Item 
                    }
                }
            ));

            const command = new BatchWriteItemCommand({
                RequestItems: {
                    [table]: putRequests
                }
            });

            await docClient.send(command);
        }
    } catch (error) {
        throw error;
    }
}

getThirdPartyData(process.argv[2])

