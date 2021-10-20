const dbserver = require('../dao/dbserver')

exports.register = function (req, res) {
  const account = req.body.account;
  const password = req.body.password;
  const nickname = req.body.nickname;
  const balance = req.body.balance;
  const updated_at = new Date();
  const created_at = new Date();

  dbserver.register(
    account,
    password,
    nickname,
    balance,
    updated_at,
    created_at,
    res
  );
};

exports.login = function (req, res) {
  const account = req.body.account
  const password = req.body.password
  const updated_at = new Date()
  const created_at = new Date()
  
  dbserver.login(account, password, updated_at, created_at, res)
}

exports.userData = function (req, res) {
  const id = req.id
  dbserver.userData(id, res)
}

exports.record = function (req, res) {
  const id = req.id;
  
  dbserver.record(id, res);
};

exports.bet = function (req, res) {
  const id = req.id;
  const issue = req.body.issue;
  const settle_n1 = req.body.settle_n1;
  const settle_n2 = req.body.settle_n2;
  const settle_n3 = req.body.settle_n3;
  const settle_n4 = req.body.settle_n4;
  const settle_n5 = req.body.settle_n5;
  const status = 0;
  const settle_amount = 50;
  const gain_amount = 0;
  const updated_at = new Date();
  const created_at = new Date();

  dbserver.bet(
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
  );
};
