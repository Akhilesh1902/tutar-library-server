import { MongoClient } from 'mongodb';

export class MongoDBIntegration {
  constructor(URL, dbName) {
    this.client = new MongoClient(URL);
    this.dbName = dbName;
    this.connect();
  }
  connect() {
    try {
      this.client.connect().then(() => {
        console.log('connected successfully for the mongo db');
      });
      //   this._getCollectionData('model-metadata');
    } catch (e) {
      console.log(e);
    }
  }
  async _getCollectionData(collectionName) {
    console.log('getting collection data');
    // console.log({ collectionName });
    const result = await this.client
      ?.db(this.dbName)
      .collection(collectionName)
      .find()
      .toArray();
    // console.log({ result });
    return result;
  }
  async uploadData(data, identifier, collectionName) {
    let result;
    if (identifier === 'name') {
      result = await this.client
        ?.db(this.dbName)
        .collection(collectionName)
        .updateOne({ name: data.name }, { $set: data }, { upsert: true });
    } else if (identifier === 'username') {
      result = await this.client
        ?.db(this.dbName)
        .collection(collectionName)
        .updateOne(
          { username: data.username },
          { $set: data },
          { upsert: true }
        );
    }
    console.log(result);
    return result;
  }
  async addData(data, collectionName) {
    console.log({ data });
    const { name } = data;
    const identifier = name ? 'name' : 'username';
    console.log(identifier);
    const result = await this.uploadData(data, identifier, collectionName);
    return result;
    // const result = await this.client
    //   ?.db(this.dbName)
    //   .collection(collectionName)
    //   .updateOne(
    //     { identifier: data.identifier },
    //     { $set: data },
    //     { upsert: true }
    //   );
    // console.log(result);
    // return result;
  }
}
