const AWS = require('aws-sdk');

// const fs = require('fs');

AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'People';

module.exports = {
  async getPeople() {
    const params = {
      TableName: table,
    };
    const result = await docClient.scan(params).promise().then((data) => data.Items);
    return result;
  },
  async getPersonById(id) {
    const params = {
      TableName: table,
      Key: {
        id,
      },
    };
    const result = await docClient.get(params).promise().then((data) => data.Item);
    return result;
  },
};
