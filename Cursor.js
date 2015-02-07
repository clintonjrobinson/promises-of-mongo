"use strict";

var MongoCursor = require('mongodb').Cursor;

exports = module.exports = Cursor;

var cursor = Cursor.prototype;

function Cursor(_cursor) {
  if (!(this instanceof Cursor)) return new Cursor(_cursor);

  if (!_cursor || _cursor.constructor !== MongoCursor) {
    throw new Error('A MongoDB Cursor Must be provided.');
  }

  this._cursor = _cursor;
}

cursor.limit = function(lim) {
  this._cursor.limit(lim);
  return this;
};

cursor.next = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    self._cursor.next(function(err, doc) {
      if (err) {
        reject(err);
        return;
      }

      resolve(doc);
    });
  });
};

cursor.toArray = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    self._cursor.toArray(function(err, array) {
      if (err) {
        reject(err);
        return;
      }

      resolve(array);
    })
  });
};