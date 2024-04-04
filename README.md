# kryptoVizyon_cloud_based_data_visualization_website

## Dynamo DB

Create tables with the following configurations:

| Table Name        | Partition Key | Sort Key               | Read Capacity          | Write Capacity | GSI Name                  | GSI Partition Key | GSI Sort Key          |
| -----------       | -----------   | -----------            | -----------            | -----------    | -----------               | -----------       |       -----------                |
| News              | id (string)   | timestamp (number)     | 1                      |          20    | symbol-timestamp-index    | symbol            | timestamp             |
| Crypto            | id (string)   | timestamp (number)     | 1                      |       180      | -                         | -                 | -                     |
| Sentiments        | id (string)   | timestamp (number)     | 1                      |           1    | -                         | -                 | -                     |
| WebSocketClients  | id (string)   | -                      | 1                      |            1   | -                         | -                 | -                     |

## Lambda Functions

Create the following lambda functions:

### SentimentAnalysis

1. Set the runtime to `Node.js 20.x`.
2. Add trigger dynamodb stream to `News` table.
3. Set Configuration timeout to 1 minute.