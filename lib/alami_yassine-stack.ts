import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class AlamiYassineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

     // Créer le bucket S3
     const bucket = new s3.Bucket(this, 'MyBucket', {
      bucketName: 'mybucket66',
      publicReadAccess: true,
    });

    // Créer la lambda pour afficher la liste des documents
    const listDocumentsLambda = new lambda.Function(this, 'ListDocumentsLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambdas'), 
      handler: 'docs.handler', 
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    // Créer la lambda pour générer une vignette
    const generateThumbnailLambda = new lambda.Function(this, 'GenerateThumbnailLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambdas'), 
      handler: 'vig.handler', 
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    // Autoriser la lambda à accéder au bucket S3
    bucket.grantReadWrite(listDocumentsLambda);
    bucket.grantReadWrite(generateThumbnailLambda);
  }
}

const app = new cdk.App();
new AlamiYassineStack(app, 'AlamiYassineStack');
app.synth();
