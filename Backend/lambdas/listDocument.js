const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const bucketName = "jobtrackerdocuments";
    const params = {
      Bucket: bucketName,
    };

    const s3Data = await s3.listObjectsV2(params).promise();
    const filesList = s3Data.Contents.map((file) => {
      // Generate a presigned URL valid for 1 hour
      const url = s3.getSignedUrl("getObject", {
        Bucket: bucketName,
        Key: file.Key,
        Expires: 3600, // 1 hour
      });

      return {
        Key: file.Key,
        LastModified: file.LastModified,
        Url: url,
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, PUT, PATCH, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
      body: JSON.stringify(filesList),
    };
  } catch (error) {
    console.error("Error listing documents:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not list documents" }),
    };
  }
};
