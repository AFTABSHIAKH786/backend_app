const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.MINIO_ACCESS_KEY,
  secretAccessKey: process.env.MINIO_SECRET_KEY,
  endpoint: new AWS.Endpoint(`http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`),
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

module.exports = s3;
