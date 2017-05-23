import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;

let DB_POOL = {};

/*****************************************************************************
 *
 * url: 连接地址 mongodb://10.101.2.8:33017,10.101.2.9:33017,10.101.2.10:33017?replicaSet=editor
 * key: 唯一标识该连接(#{urlSummary}-db-#{dbName}), etc('web-event-db-tools'), 每个key对应一个db连接
 * dbName: 数据库名称
 *
****************************************************************************/
const open = async (url, key, dbName) => {
  return new Promise((resolve, reject) => {
    try {
      if (DB_POOL[key]) {
        resolve(DB_POOL[key]);
      }
      MongoClient.connect(url, (err, db) => {
        if (err) {
          if (db && db.close) {
            db.close();
          }
          resolve(null);
        } else {
          console.log('new connect to db');
          if (db && db.db(dbName)) {
            console.log('connect to db: ' + dbName);
            DB_POOL[key] = db.db(dbName);
            resolve(DB_POOL[key]);
          } else {
            resolve(null);
          }
        }
      });
    } catch (err) {
      resolve(null);
    }
  });
};

export default {
  open: open
};
