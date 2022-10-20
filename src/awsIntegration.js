import AWS from 'aws-sdk';
// const Bucket = 'tutar-webapp';
const Bucket = 'library-panel';

export class AWSInstance {
  constructor(region, accessKeyId, secretAccessKey) {
    this.s3 = new AWS.S3({
      region,
      accessKeyId,
      secretAccessKey,
    });
    this.uploadParams = { Bucket, Key: '', Body: '' };
  }
  async getObject(Key) {
    console.log({ Key });
    return new Promise((resolve) => {
      this.s3.getObject({ Bucket, Key }, (err, data) => {
        if (data) resolve(data.Body);
      });
    });
  }
  async putObject(Key, Body) {
    this.uploadParams.Body = Body;
    this.uploadParams.Key = Key;
    this.s3.upload(this.uploadParams, (err, data) => {
      if (err) console.log('err \n' + err);
      if (data) console.log('upload succes on ' + data.location);
    });
  }
}
