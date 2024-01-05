const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const applicationId = event.pathParameters.applicationId;

    const params = {
      TableName: "JobApplications",
      Key: { applicationId: applicationId },
      UpdateExpression:
        "set #status = :status, #notes = :notes, #resumeUrl = :resumeUrl, #lastUpdated = :lastUpdated",
      ExpressionAttributeNames: {
        "#status": "status",
        "#notes": "notes",
        "#resumeUrl": "resumeUrl",
        "#lastUpdated": "lastUpdated",
      },
      ExpressionAttributeValues: {
        ":status": body.status,
        ":notes": body.notes,
        ":resumeUrl": body.resumeUrl,
        ":lastUpdated": body.lastUpdated,
      },
      ReturnValues: "UPDATED_NEW",
    };

    const message = `Hey there,

Just a reminder about your job application:

- Company Name: ${body.companyName}
- Application ID: ${applicationId}
- Current Status: ${body.status}
- Last Updated: ${new Date().toISOString()}
- Notes: ${body.notes}

Remember to follow up if needed!

Cheers Gaurav`;

    const subject = `Reminder: Application Update for ${body.companyName}`;

    const param = {
      Message: message,
      Subject: subject,
      TopicArn:
        "arn:aws:sns:us-east-1:213373454223:JobApplicationNotifications",
    };

    await sns.publish(param).promise();

    await dynamoDB.update(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify({ message: "Application updated successfully" }),
    };
  } catch (error) {
    console.error("Error updating application:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Adjust as needed
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify({ error: "Could not update application" }),
    };
  }
};
