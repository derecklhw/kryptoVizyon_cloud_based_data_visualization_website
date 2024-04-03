# kryptoVizyon_cloud_based_data_visualization_website

## Dynamo DB

Issue:

```bash
ProvisionedThroughputExceededException: The level of configured provisioned throughput for the table was exceeded. Consider increasing your provisioning level with the UpdateTable API.
```

Fix:
Go to AWS Console and edit DynamoDB tables write capacity to 20 for News and 180 for Crypto.
