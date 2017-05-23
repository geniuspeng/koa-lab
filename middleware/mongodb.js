/**
 * mongodb promise wrapper
 */

import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;

function open (url) {
  return new Promise((resolve, reject) => {
    try {
      MongoClient.connect(url, (err, db) => {
        if (err) {
          close(db);
          reject(err);
        } else {
          resolve(db);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

function close (db) {
  if (db && db.close) {
    db.close();
  }
}

export default {
  open: open,
  close: close
};
