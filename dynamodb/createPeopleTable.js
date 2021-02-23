const AWS = require('aws-sdk');

AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const dynamodb = new AWS.DynamoDB();

const params = {
  TableName: 'People',
  KeySchema: [{
    AttributeName: 'id',
    KeyType: 'HASH',
  },

  ],
  AttributeDefinitions: [{
    AttributeName: 'id',
    AttributeType: 'N',
  }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

dynamodb.createTable(params, (err, data) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
  } else {
    // eslint-disable-next-line no-console
    console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
  }
});
