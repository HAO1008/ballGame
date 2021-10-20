const dbserver = require("../dao/dbserver");

// 期數取得
exports.lotteryPeriod = function (req, res) {
  const status = req.body.status;
  const now = new Date()

  dbserver.lotteryPeriod(now, status, res);
};

// 期數上期取得
exports.lastPeriod = function (req,res) {
  const now = new Date();
  const status = req.body.status

  dbserver.lastPeriod(now, status, res)
}

// 期數開獎
exports.lotteryDraw = function (req,res) {
  const issue = req.body.issue
  const n1 = req.body.n1
  const n2 = req.body.n2
  const n3 = req.body.n3
  const n4 = req.body.n4
  const n5 = req.body.n5
  const status = req.body.status
  const updated_at = new Date()
  
  dbserver.lotteryDraw(issue, n1, n2, n3, n4, n5, status, updated_at, res)
}
