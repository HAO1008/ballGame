const conn = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const { runQuery } = require("./runquery");

conn.connect();

exports.register = async function (
  account,
  password,
  nickname,
  balance,
  updated_at,
  created_at,
  res
) {
  try {
    const sql =
      "INSERT INTO users (account, password, nickname, balance, updated_at, created_at) VALUES(?, ?, ?, ?, ?, ?) ";
    const sqlParams = [
      account,
      password,
      nickname,
      balance,
      updated_at,
      created_at,
    ];
    const data = await runQuery(sql, sqlParams);
    res.send({ status: 200, data });
  } catch (err) {
    console.log(err);
    res.send({ status: 400 });
  }
};

exports.login = async function (account, password, updated_at, created_at, res) {
  try {
    const token = uuidv4();
    const sql =
      " SELECT * FROM users where account = ? AND password = ? LIMIT 1 ";
    const sqlParams = [account, password];
    const data = await runQuery(sql, sqlParams);
    if (data.length == 0) {
      res.send({ status: 300 });
      return
    } 
    const id = data[0].id
    const sql1 =
      "INSERT INTO tokens(tokens, user_id, updated_at, created_at) VALUES(?, ?, ?, ?)";
    const sqlParams1 = [token, id, updated_at, created_at];
    const result = await runQuery(sql1, sqlParams1);
    res.send({ status: 200, data, result, token });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400, err });
  }
};

exports.userData = async function (id, res) {
  try {
    const sql = "SELECT * FROM users where id = ?";
    const sqlParams = [id];
    const result = await runQuery(sql, sqlParams);
    res.send({ status: 200, result });
  } catch (err) {
    console.log(err);
    res.send({ status: 400 });
  }
};

exports.record = async function (id, res) {
  try {
    const sql = "SELECT * FROM settle_history where user_id = ?";
    const sqlParams = [id];
    const result = await runQuery(sql, sqlParams);
    res.send({ status: 200, result });
  } catch (err) {
    console.log(err);
    res.send({ status: 400 });
  }
};

exports.bet = async function (
  id,
  issue,
  settle_n1,
  settle_n2,
  settle_n3,
  settle_n4,
  settle_n5,
  status,
  settle_amount,
  gain_amount,
  updated_at,
  created_at,
  res
) {
  try {
    const sql = "SELECT * FROM lottery_issues WHERE issue = ?";
    const sqlParams = [issue];
    const stopBet = await runQuery(sql, sqlParams);
    const now = moment(); 
    const cloesTime = moment(stopBet[0].close_at); 
    const cloesRange = moment(stopBet[0].close_at).add(1, "minutes"); 
    if (now >= cloesTime && now <= cloesRange) {
      res.send({ status: 300 });
      return;
    }
    const sql1 = "SELECT * FROM users WHERE id = ?";
    const sqlParams1 = [id];
    const user = await runQuery(sql1, sqlParams1);
    const sql2 =
      `INSERT INTO
        settle_history
        (
          user_id,issue,
          settle_n1,
          settle_n2,
          settle_n3,
          settle_n4,
          settle_n5,
          status,
          settle_amount,
          gain_amount,
          updated_at,
          created_at
        ) 
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const sqlParams2 = [
      id,
      issue,
      settle_n1,
      settle_n2,
      settle_n3,
      settle_n4,
      settle_n5,
      status,
      settle_amount,
      gain_amount,
      updated_at,
      created_at,
    ];
    let arr = [settle_n1, settle_n2, settle_n3, settle_n4, settle_n5];
    let ball = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
      23, 24, 25, 26, 27, 28, 29, 30,
    ];
    for (let i = 0; i < arr.length; i++) {
      arr = arr.sort();
      let findBall = ball.indexOf(Number(arr[i]))
      if(arr[i] == arr[i + 1] || findBall < 0) {
        res.send({ status: 300 });
        return;
      }
    }
    if (user[0].balance >= settle_amount) {
      const sql3 = "UPDATE users SET balance = ? WHERE id = ?";
      const sqlParams3 = [user[0].balance - settle_amount, id];
      const result = await runQuery(sql2, sqlParams2);
      const updateBalance = await runQuery(sql3, sqlParams3);
      res.send({ status: 200, result, user, updateBalance });
    } else {
      res.send({ status: 300 });
    }
  } catch (err) {
    console.log(err);
    res.send({ status: 400 });
  }
};

exports.deleteToken = async function (user_id, res) {
  try {
    const sql = "DELETE FROM tokens where user_id = ?";
    const sqlParams = [user_id];
    const data = await runQuery(sql, sqlParams);
    console.log("成功移除token");
    res.send({ status: 200 });
  } catch (err) {
    console.log(err);
    res.send({ status: 400 });
  }
};

exports.lotteryDraw = async function (
  issue,
  n1,
  n2,
  n3,
  n4,
  n5,
  status,
  updated_at
) {
  try {
    const sql =`
    UPDATE 
      lottery_issues 
    SET 
      n1 = ?, 
      n2 = ?, 
      n3 = ?,
      n4 = ?, 
      n5 = ?, 
      status = ?, 
      updated_at = ? 
    WHERE 
      issue = ?
    `;
    const sqlParams = [n1, n2, n3, n4, n5, status, updated_at, issue];
    const data = await runQuery(sql, sqlParams);

    const sql1 = "UPDATE settle_history SET status = ? WHERE issue = ?";
    const sqlParams1 = [status, issue];
    const result = await runQuery(sql1, sqlParams1);
    res.send({ status: 200, data, result });
  } catch (err) {
    console.log(err);
    res.send({ status: 400 });
  }
};

exports.lotteryPeriod = async function (now, status, res) {
  try {
    const sql =
      "SELECT issue,open_at,close_at FROM lottery_issues WHERE close_at > ? AND status = ? LIMIT 1";
    const sqlParams = [now, status];
    const data = await runQuery(sql, sqlParams);
    if (now < data[0].open_at) {
      const sql1 =
        "SELECT issue,open_at,close_at FROM lottery_issues WHERE close_at < ? AND status = ? ORDER BY issue DESC LIMIT 1";
      const sqlParams1 = [now, status];
      const data = await runQuery(sql1, sqlParams1);
      res.send({ status: 200, data, time: new Date() });
      return;
    }
    res.send({ status: 200, data, time: new Date() });
  } catch (err) {
    console.log(err);
    res.send({ status: 400 });
  }
};

exports.lastPeriod = async function (now, status, res) {
  try {
    const sql =
      "SELECT * FROM lottery_issues WHERE open_at < ? AND status = ? ORDER BY issue DESC LIMIT 1";
    const sqlParams = [now, status];
    const data = await runQuery(sql, sqlParams);
    res.send({ status: 200, data });
  } catch (err) {
    console.log(err);
    res.send({ status: 400 });
  }
};
