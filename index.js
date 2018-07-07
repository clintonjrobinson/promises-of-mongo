const MongoCursor = require('mongodb').Cursor;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

class Mongo {
  constructor({ host = 'localhost', port = '27017', db = 'dev', url }) {
    //If a URL wasn't provided, create one
    this.dbName = db;

    if (!url) {
      this.url = `mongodb://${host}:${port}/${db}`;
    }
  }

  static get Cursor() {
    return MongoCursor;
  }

  static get ObjectID() {
    return ObjectID;
  }

  async connect() {
    if (this.db) {
      return this.db;
    }

    this.client = await MongoClient.connect(this.url);

    this.db = this.client.db(this.dbName);

    return this.db;
  }

  async find(collection, query, options = {}) {
    await this.connect();

    return await this.db.collection(collection).find(query, options);
  }

  async findOne(collection, query, options = {}) {
    await this.connect();

    return await this.db.collection(collection).findOne(query, options);
  }

  async findOneAndDelete(collection, query, options = {}) {
    await this.connect();

    return await this.db
      .collection(collection)
      .findOneAndDelete(query, options);
  }

  async findOneAndUpdate(collection, query, update, options = {}) {
    await this.connect();

    return await this.db
      .collection(collection)
      .findOneAndUpdate(query, update, options);
  }

  async remove(collection, query, options = {}) {
    await this.connect();
    return await this.db.collection(collection).remove(query, options);
  }

  async updateMany(collection, query, update, options = {}) {
    await this.connect();
    return await this.db
      .collection(collection)
      .updateMany(query, update, options);
  }

  async count(collection, query, options = {}) {
    await this.connect();
    return await this.db.collection(collection).count(query, options);
  }

  async insert(collection, doc) {
    await this.connect();

    const isArray = Array.isArray(doc);

    const result = await this.db
      .collection(collection)
      [isArray ? 'insertMany' : 'insertOne'](doc);

    return isArray ? result.ops : result.ops[0];
  }

  async createIndexes(collection, indexes) {
    await this.connect();

    return this.db.collection(collection).createIndexes(indexes);
  }
}

exports = module.exports = Mongo;
