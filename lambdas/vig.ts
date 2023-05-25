import * as AWS from 'aws-sdk';
const sharp = require('sharp');

export const handler = async (event: any) => {
  const s3 = new AWS.S3();
  const bucketName = 'mybucket66'; 

  try {
    const record = event.Records[0];
    const key = record.s3.object.key;

    // Télécharge l'image depuis S3
    const imageObject = await s3.getObject({ Bucket: bucketName, Key: key }).promise();
    const imageBuffer = imageObject.Body as Buffer;

    // Génère la vignette
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(200, 200) // Définit la taille de la vignette (200x200 pixels)
      .toBuffer();

    // Téléverse la vignette dans S3
    await s3.putObject({
      Bucket: bucketName,
      Key: `thumbnails/${key}`, // Définit le chemin et le nom de la vignette
      Body: resizedImageBuffer,
    }).promise();

    return {
      statusCode: 200,
      body: 'Thumbnail generated successfully',
    };
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


