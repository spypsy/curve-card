"use strict"; //eslint-disable-line
const env = process.env;
const ENV = env.ENV || 'dev';

const LOCALHOST = env.LOCALHOST_IP || '0.0.0.0';

const config = {};

// env     = full name of the environment
// host    = where the server is served
// apphost = where client is served
// api     = where the api is served

switch (ENV) {

  case 't':
  case 'test':
    config.env = 'test';
    config.host = 'http://' + LOCALHOST + ':3001/';
    config.apphost = 'http://' + LOCALHOST + ':8080/';
    break;

  case 'd':
  case 'dev':
  case 'development':
    config.env = 'development';
    config.host = 'http://' + LOCALHOST + ':3000/';
    break;

  case 'p':
  case 'prod':
  case 'production':
    config.env = 'production';
    config.host = 'https://curve-cards.herokuapp.com/';//'https://.herokuapp.com/';
    config.dbUri = env.MONGODB_URI;
    break;

  default:
    throw Error('Invalid environment (ENV): ' + ENV);

}

config.api = config.host + 'api';

export default config;
