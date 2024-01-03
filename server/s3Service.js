const { S3 } = require("aws-sdk");
const uuid = require("uuid").v4;

exports.s3Uploadv2 = async (file, folder, bucketName) => {
  const s3 = new S3();

  const params = {
    Bucket: bucketName,
    Key: `${folder}/${uuid()}-${file.originalname}`,
    Body: file.buffer,
  };

  return await s3.upload(params).promise();
};

// Function to delete a file from S3
exports.s3DeleteFile = async ( key, bucketName) => {
  const s3 = new S3();

  const params = {
    Bucket: bucketName,
    Key: key,
  };

  return await s3.deleteObject(params).promise();
};