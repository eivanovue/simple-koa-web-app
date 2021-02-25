const AWS = require('aws-sdk');

AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000',
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'People';

module.exports = {
  async addPerson(item) {
    const params = {
      TableName: table,
      Item: {
        id: item.id,
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        gender: item.gender,
      },
    };

    const result = await docClient.put(params).promise();
    return result;
  },
  async getPeople() {
    const params = {
      TableName: table,
    };
    const result = await docClient.scan(params).promise();
    return result.Items;
  },
  async getPersonById(id) {
    const params = {
      TableName: table,
      Key: {
        id,
      },
    };
    const result = await docClient.get(params).promise();
    return result.Item;
  },
  async getPersonByAtttribute(attri, value) {
    const params = {
      TableName: table,
      FilterExpression: '#attri = :value',
      ExpressionAttributeNames: {
        '#attri': attri,
      },
      ExpressionAttributeValues: {
        ':value': attri === 'id' ? Number(value) : value,
      },
    };
    const result = await docClient.scan(params).promise();
    return result.Items;
  },
  async updatePerson(id, person) {
    const params = {
      TableName: table,
      Key: {
        id: Number(id),
      },
      UpdateExpression: 'set first_name = :fname, last_name = :lname, gender = :gender, email = :email',
      ExpressionAttributeValues: {
        ':fname': person.first_name,
        ':lname': person.last_name,
        ':gender': person.gender,
        ':email': person.email,
      },
      ReturnValues: 'UPDATED_NEW',
    };
    const result = await docClient.update(params).promise();
    return result;
  },
  async deletePerson(id) {
    const params = {
      TableName: table,
      Key: {
        id: Number(id),
      },
    };
    const result = await docClient.delete(params).promise();
    return result;
  },
};
