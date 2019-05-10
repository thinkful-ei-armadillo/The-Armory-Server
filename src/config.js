'use strict';

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  //commented out for deployment
  //DB_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/armory',
  DB_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/armory',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
  PARTY_DISPLAY_LIMIT: 20,

};
