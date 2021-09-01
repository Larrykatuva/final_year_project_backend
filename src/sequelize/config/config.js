require('dotenv').config();

module.exports = {
  "development": {
    "username":'root',//process.env.DATABASE_USER,
    "password":'Larry@98?!KU',//process.env.DATABASE_PASSWORD,
    "database":'final_year',//process.env.DATABASE_NAME,
    "host":'192.168.0.14',//process.env.DATABASE_HOST,
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
