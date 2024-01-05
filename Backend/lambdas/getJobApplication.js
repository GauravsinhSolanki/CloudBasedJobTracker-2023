const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const params = {
      TableName: "JobApplications",
      // filter adition here if I wish in future.
    };

    const data = await dynamoDB.scan(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error("Error retrieving applications:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve applications" }),
    };
  }
};
