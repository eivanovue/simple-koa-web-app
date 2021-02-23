const AWS = require('aws-sdk');

AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const dynamodb = new AWS.DynamoDB();

const params = {
  TableName: 'People',
};

dynamodb.deleteTable(params, (err, data) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
  } else {
    // eslint-disable-next-line no-console
    console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
  }
});
