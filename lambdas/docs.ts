import * as AWS from 'aws-sdk';

export const handler = async (event: any) => {
  const s3 = new AWS.S3();
  const bucketName = 'mybucket66'; 

  try {
    const listObjectsResponse = await s3.listObjects({ Bucket: bucketName }).promise();

    if (listObjectsResponse.Contents) {
      const documents = listObjectsResponse.Contents.map((object: AWS.S3.Object) => object.Key);

      return {
        statusCode: 200,
        body: JSON.stringify(documents),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify('No contents found'),
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify(error.message),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify('Unknown error occurred'),
      };
    }
  }
};

