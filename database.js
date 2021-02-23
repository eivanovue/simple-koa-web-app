const AWS = require('aws-sdk');
const config = require('./config/config.js');

const isDev = true;

module.exports = (app) => {
  // Gets all people
  app.get('/api/people', (req, res) => {
    if (isDev) {
      AWS.config.update(config.aws_local_config);
    } else {
      AWS.config.update(config.aws_remote_config);
    }
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_name,
    };
    docClient.scan(params, (err, data) => {
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error',
        });
      } else {
        const { Items } = data;
        res.send({
          success: true,
          message: 'Loaded people',
          people: Items,
        });
      }
    });
  }); // end of app.get(/api/people)
  // Get a single person by id
  app.get('/api/person', (req, res) => {
    if (isDev) {
      AWS.config.update(config.aws_local_config);
    } else {
      AWS.config.update(config.aws_remote_config);
    }
    const fruitId = req.query.id;
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: config.aws_table_name,
      KeyConditionExpression: 'fruitId = :i',
      ExpressionAttributeValues: {
        ':i': fruitId,
      },
    };
    docClient.query(params, (err, data) => {
      if (err) {
        res.send({
          success: false,
          message: 'Error: Server error',
        });
      } else {
        console.log('data', data);
        const { Items } = data;
        res.send({
          success: true,
          message: 'Loaded people',
          people: Items,
        });
      }
    });
  });
  // Add a person
  // app.post('/api/person', (req, res) => {
  //   if (isDev) {
  //     AWS.config.update(config.aws_local_config);
  //   } else {
  //     AWS.config.update(config.aws_remote_config);
  //   }
  //   const { type, color } = req.body;
  //   // Not actually unique and can create problems.
  //   const fruitId = (Math.random() * 1000).toString();
  //   const docClient = new AWS.DynamoDB.DocumentClient();
  //   const params = {
  //     TableName: config.aws_table_name,
  //     Item: {
  //       fruitId,
  //       fruitType: type,
  //       color,
  //     },
  //   };
  //   docClient.put(params, (err, data) => {
  //     if (err) {
  //       res.send({
  //         success: false,
  //         message: 'Error: Server error',
  //       });
  //     } else {
  //       console.log('data', data);
  //       res.send({
  //         success: true,
  //         message: 'Added fruit',
  //         fruitId,
  //       });
  //     }
  //   });
  // });
};
