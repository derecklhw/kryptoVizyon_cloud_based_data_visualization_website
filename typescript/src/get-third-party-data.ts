import { BatchWriteItemCommand, DynamoDBClient, WriteRequest } from '@aws-sdk/client-dynamodb';
import process from 'node:process';
import { getNewsData } from './text-data';
import { getNumericalData } from './numerical-data';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

/*
* This function retrieves data from third party APIs and writes it to DynamoDB
* @param {string} table - The name of the table to write the data to
* @returns {Promise<void>}
*/
const getThirdPartyData = async (table: string) => {
    // Validate input
    if (!table) throw new Error('No table provided');
    if (table !== "News" && table !== "Crypto") throw new Error('Invalid table type');

    try {
        // Create a DynamoDB client and a DynamoDBDocumentClient
        const client = new DynamoDBClient({ region: 'us-east-1' })
        const docClient = DynamoDBDocumentClient.from(client);

        const symbols: string[] = ['BTC', 'ETH', 'BNB', 'SOL', 'DOGE'];
        const batchWriteLimit : number = 25;

        const dataChunks: WriteRequest[][] = [];
        let currentChunk: WriteRequest[] = [];

        // Get data for each symbol and add it to the current chunk
        for (const symbol of symbols) {
            // Get the data from the appropriate API
            const requestData = table === 'Crypto' ? await getNumericalData(symbol) : await getNewsData(symbol);
            requestData.forEach((item: WriteRequest) => {
                // If the current chunk is full, add it to the dataChunks array and create a new chunk
                if (currentChunk.length >= batchWriteLimit) {
                    dataChunks.push(currentChunk);
                    currentChunk = [];
                }
                currentChunk.push(item);    
            });
        }

        // Add the last chunk to the dataChunks array
        if (currentChunk.length > 0) dataChunks.push(currentChunk);

        // Write the data to the DynamoDB table in batches
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

