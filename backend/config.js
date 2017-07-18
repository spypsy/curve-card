export const getConfig = () => {
  const ENV = process.env;
  const config = {
    development: {
      db: {
        MONGO_URI: ENV.MONGODB_URI || 'mongodb://localhost:27017/curve',
      },
      token: {
        secret: ENV.TOKEN_SECRET || '',
      },
    },
    production: {
      db: {
        MONGO_URI: ENV.MONGODB_URI,
      },
      token: {
        secret: ENV.TOKEN_SECRET,
      },
    },
  };
  if (!config[ENV.ENV]) {
    throw new Error('Incorrect env ' + ENV.ENV);
  }
  return config[ENV.ENV];
};

export const getConnectOptions = () => {
  const dbConfig = module.exports.getConfig();
  if ((dbConfig.db || {}).MONGO_URI) {
    return {
      connectString: dbConfig.db.MONGO_URI,
    };
  }
};
