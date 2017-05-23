import convict from 'convict';
import fs from 'fs';
import debug from 'debug';

const MONGO_URL = {
  test: 'mongodb://10.103.16.10:27017',
  editor: 'mongodb://10.101.2.8:33017,10.101.2.9:33017,10.101.2.10:33017?replicaSet=editor',
  web_event: 'mongodb://10.120.16.5:29017,10.120.15.42:29017,10.120.15.32:29017?replicaSet=web-event',
  web_external: 'mongodb://10.120.15.32:30017,10.120.16.5:30017,10.120.15.42:30017?replicaSet=web-external'
};

if (process.env.NODE_ENV !== 'production') {
  for (var key in MONGO_URL) {
    MONGO_URL[key] = MONGO_URL['test'];
  }
}

const conf = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  ip: {
    doc: 'The ip address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 9527,
    env: 'PORT',
  },
  mongo: {
    doc: 'mongodb url config',
    default: MONGO_URL
  }
});
/*
const d = debug('kickstarter:conf');
const env = conf.get('env');
try {
  const path = `${__dirname}/${env}.json`;

  d('trying to access %s', path);
  fs.accessSync(path, fs.F_OK);

  conf.loadFile(path);
} catch (error) {
  d('file doesn\'t exist, loading defaults');
}
*/
conf.validate({ strict: true });

export default conf;
