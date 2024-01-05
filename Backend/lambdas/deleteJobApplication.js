const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    // Extract applicationId from pathParameters, not from the body
    const applicationId = event.pathParameters.applicationId;

    // If applicationId isn't present, return an error
    if (!applicationId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing or invalid applicationId" }),
      };
    }

    const params = {
      TableName: "JobApplications",
      Key: { applicationId: applicationId },
    };

    await dynamoDB.delete(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify({ message: "Application deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting application:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not delete application",
        details: error.message,
      }),
    };
  }
};
