const AWS = require("aws-sdk");
const sns = new AWS.SNS();

exports.handler = async (event) => {
  try {
    const params = {
      Message: event.message, // Your notification message
      Subject: event.subject, // Subject for email notifications
      TopicArn:
        "arn:aws:sns:us-east-1:213373454223:JobApplicationNotifications",
    };

    await sns.publish(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify({ message: "Notification sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending notification:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not send notification" }),
    };
  }
};
