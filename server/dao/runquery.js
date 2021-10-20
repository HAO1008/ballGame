const conn = require("../config/db")

function runQuery(sql, sqlParams) {
  // console.log(conn.format(sql, sqlParams));
  return new Promise((resolve, reject) => {
    conn.query(sql, sqlParams, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = { runQuery };
