import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {aws_cloudfront, aws_cloudfront_origins, CfnOutput} from "aws-cdk-lib";
import * as path from "path";
import * as s3_deployment from "aws-cdk-lib/aws-s3-deployment";
export class CbvaAppPageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CbvaAppPageQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });


    const bucket = new s3.Bucket(this, 'CbvaAppPageBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: "cbvaapp-bucket",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    //upload folder to s3 bucket
    new s3_deployment.BucketDeployment(this, 'DeployWebsite', {
        sources: [s3_deployment.Source.asset(path.join(__dirname, '../assets'))],
        destinationBucket: bucket,
        cacheControl: [s3_deployment.CacheControl.fromString('max-age=0')],
    });



    const distribution = new aws_cloudfront.Distribution(this, 'CbvaAppPageDistribution', {
        defaultBehavior: { origin: new aws_cloudfront_origins.S3Origin(bucket) },
    });

    new CfnOutput(this, 'DistributionDomainName', {
        value: distribution.distributionDomainName,
    })
  }
}
