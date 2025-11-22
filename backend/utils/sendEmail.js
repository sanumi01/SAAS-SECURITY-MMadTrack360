const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({ region: 'eu-west-2' }); // London region

const ses = new AWS.SES();

function sendResetEmail(email, token) {
  const params = {
    Source: process.env.SES_SENDER_EMAIL,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: 'MMadTrack360 Password Reset' },
      Body: {
        Text: {
          Data: `Click the link to reset your password:\nhttps://mamaadsolution.com/reset?token=${token}`
        }
      }
    }
  };

  return ses.sendEmail(params).promise();
}

module.exports = sendResetEmail;
