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
  const env = ENV.ENV || 'development';
  return config[env]
};

export const getConnectOptions = () => {
  const dbConfig = module.exports.getConfig();
  if ((dbConfig.db || {}).MONGO_URI) {
    return {
      connectString: dbConfig.db.MONGO_URI,
    };
  }
};
