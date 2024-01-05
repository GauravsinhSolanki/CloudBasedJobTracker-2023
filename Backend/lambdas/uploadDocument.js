const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    let body = JSON.parse(event.body);
    let decodedFile = Buffer.from(body.fileContent, "base64");
    const params = {
      Bucket: "jobtracker-document-holder",
      Key: body.fileName,
      Body: decodedFile,
      ContentType: body.fileType,
    };

    await s3.putObject(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify({ message: "File uploaded successfully" }),
    };
  } catch (error) {
    console.error("Error uploading document:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // CORS header
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ error: "Could not upload document" }),
    };
  }
};
