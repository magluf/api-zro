require('dotenv').config();

module.exports = () => {
  return {
    development: {
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    },
    production: {
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    },
  };
};
