const AWS = require('aws-sdk');

const fs = require('fs');

AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const docClient = new AWS.DynamoDB.DocumentClient();
console.log('Importing People into DynamoDB. Please wait.');
const people = JSON.parse(fs.readFileSync('../data.json', 'utf8'));
people.forEach((person) => {
  console.log(person);
  const params = {
    TableName: 'People',
    Item: {
      id: person.id,
      first_name: person.first_name,
      last_name: person.last_name,
      email: person.email,
      gender: person.gender,
    },
  };
  docClient.put(params, (err) => {
    if (err) {
      console.error('Unable to add Person', person.first_name, '. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('PutItem succeeded:', person.first_name);
    }
  });
});
