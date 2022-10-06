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
    const result = await this.client
      .db(this.dbName)
      .collection(collectionName)
      .find()
      .toArray();
    // console.log(result);
    return result;
  }
}
