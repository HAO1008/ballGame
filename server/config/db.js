const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "localhost",
  user: "lottery",
  password: "123456",
  database: "lottery",
  port: "3306",
  multipleStatements: true,
});

module.exports = conn;
