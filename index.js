"use strict";

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var Cursor = require('./Cursor');

//Expose the library
exports = module.exports = Mongo;

Mongo.Cursor = Cursor;
Mongo.ObjectID = ObjectID;

function Mongo(config) {
  if (!(this instanceof Mongo)) return new Mongo(config);

  this.config = config || {host: 'localhost', port: '27017', db: 'dev'};

  //If a URL wasn't provided, create one
  if (!this.config.url) {
    this.config.url = 'mongodb://' + this.config.host + ':' + this.config.port + '/' + this.config.db;
  }
}

Mongo.prototype.connect = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    if (self.db) {
      resolve(self.db);
      return;
    }

    MongoClient.connect(self.config.url, function(err, db) {
      if (err) {
        reject(err);
        return;
      }

      self.db = db;

      resolve(self.db);
    });
  });
};

/**
 * Returns a Promise that resolves an Iterable
 * @param collection
 * @param query
 * @returns {Promise}
 */
Mongo.prototype.find = function(collection, query, options) {
  var self = this;

  options = options || {};

  return new Promise(function(resolve, reject) {
    function go() {
      self.db.collection(collection).find(query, options, function(err, cursor) {
        err ?
          reject(err) :
          resolve(new Cursor(cursor))
        ;
      });
    }

    self.db ?
      go()
      : self.connect().then(go).catch(reject)
    ;
  });
};

Mongo.prototype.findOne = function(collection, query, options) {
  var self = this;

  options = options || {};

  return new Promise(function(resolve, reject) {
    function go() {
      self.db.collection(collection).findOne(query, options, function(err, doc) {

        err
          ? reject(err)
          : resolve(doc)
        ;
      });
    }

    self.db
      ? go()
      : self.connect().then(go).catch(reject)
    ;
  });
};

Mongo.prototype.findOneAndDelete = function(collection, query, options) {
  var self = this;

  options = options || {};

  return new Promise(function(resolve, reject) {
    function go() {
      self.db.collection(collection).findOneAndDelete(query, options, function(err, doc) {
        err
          ? reject(err)
          : resolve(doc)
        ;
      });
    }

    self.db
      ? go()
      : self.connect().then(go).catch(reject)
    ;
  });
};

Mongo.prototype.findOneAndUpdate = function(collection, query, update, options) {
  var self = this;

  options = options || {};

  return new Promise(function(resolve, reject) {
    function go() {
      self.db.collection(collection).findOneAndUpdate(query, update, options, function(err, doc) {
        err
          ? reject(err)
          : resolve(doc)
        ;
      });
    }

    self.db
      ? go()
      : self.connect().then(go).catch(reject)
    ;
  });
};


Mongo.prototype.remove = function(collection, query, options) {
  var self = this;

  options = options || {};

  return new Promise(function(resolve, reject) {
    function go() {
      self.db.collection(collection).remove(query, options, function(err, doc) {
        err
          ? reject(err)
          : resolve(doc)
        ;
      });
    }

    self.db
      ? go()
      : self.connect().then(go).catch(reject)
    ;
  });
};

Mongo.prototype.updateMany = function(collection, query, update, options) {
  var self = this;

  options = options || {};

  return new Promise(function(resolve, reject) {
    function go() {
      self.db.collection(collection).updateMany(query, update, options, function(err, doc) {
        err
          ? reject(err)
          : resolve(doc)
        ;
      });
    }

    self.db
      ? go()
      : self.connect().then(go).catch(reject)
    ;
  });
};

Mongo.prototype.count = function(collection, query, options) {
  var self = this;

  options = options || {};

  return new Promise(function(resolve, reject) {
    function go() {
      self.db.collection(collection).count(query, options, function(err, count) {
        err ?
          reject(err) :
          resolve(count)
        ;
      });
    }

    self.db ?
      go()
      : self.connect().then(go).catch(reject)
    ;
  });
};

Mongo.prototype.insert = function(collection, doc) {
  var self = this;

  return new Promise(function(resolve, reject) {
    function go() {
      var func = Array.isArray(doc) ? 'insertMany' : 'insertOne';

      self.db.collection(collection)[func](doc, function(err, result) {
        if (err) {
          reject(err);
          return;
        }

        if (func === 'insertMany') {
          resolve(result.ops);
        } else {
          resolve(result.ops[0]);
        }
      });
    }

    self.db ?
      go()
      : self.connect().then(go).catch(reject);
  });
};

Mongo.prototype.createIndexes = function(collection, indexes) {
  var self = this;

  return new Promise(function(resolve, reject) {
    function go() {
      self.db.collection(collection).createIndexes(indexes, function(err, result) {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      })
    }

    self.db ?
      go()
      : self.connect().then(go).catch(reject);
  });
};