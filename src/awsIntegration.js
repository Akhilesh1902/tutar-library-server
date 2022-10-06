import AWS from 'aws-sdk';
const Bucket = 'tutar-webapp';

export class AWSInstance {
  constructor(region, accessKeyId, secretAccessKey) {
    this.s3 = new AWS.S3({
      region,
      accessKeyId,
      secretAccessKey,
    });
  }
  async getObject(Key) {
    console.log({ Key });
    return new Promise((resolve) => {
      this.s3.getObject({ Bucket, Key }, (err, data) => {
        if (data) resolve(data.Body);
      });
    });
  }
}
