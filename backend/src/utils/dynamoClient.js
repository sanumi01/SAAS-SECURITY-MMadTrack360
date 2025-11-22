const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
module.exports = new DynamoDBClient({ region: "eu-west-2" });
