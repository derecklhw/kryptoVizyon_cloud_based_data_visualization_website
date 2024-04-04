# kryptoVizyon_cloud_based_data_visualization_website

## Dynamo DB

Create tables with the following schemas:

| Table Name        | Partition Key | Sort Key                  | GSI Name                  | GSI Partition Key | GSI Sort Key          |
| -----------       | -----------   | -----------               | -----------               | -----------       | -----------           |
| News              | id (string)   | timestamp (number)        | symbol-timestamp-index    | symbol            | timestamp             |
| Crypto            | id (string)   | timestamp (number)        | -                         | -                 | -                     |
| Sentiments        | id (string)   | timestamp (number)        | -                         | -                 | -                     |
| WebSocketClients  | id (string)   | -                         | -                         | -                 | -                     |

## Issues

Issue:
ProvisionedThroughputExceededException: The level of configured provisioned throughput for the table was exceeded. Consider increasing your provisioning level with the UpdateTable API.

Fix:
Go to AWS Console and increase DynamoDB tables write capacity by disabling auto scaling and setting them to 20 for News and 180 for Crypto.
