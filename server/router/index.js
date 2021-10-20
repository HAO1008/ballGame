const users = require("../controll/users")
const token = require("../controll/token")
const lottery = require("../controll/lottery")

module.exports = function (app) {
  app.post("/register", function (req, res) {
    users.register(req, res);
  });

  app.post("/login", function (req, res) {
    users.login(req, res);
  });

  app.post("/token/userdata", function (req, res) {
    users.userData(req, res);
  });
  
  app.post("/token/record", function (req, res) {
    users.record(req, res);
  });
  
  app.post("/token/bet", function (req, res) {
    users.bet(req, res);
  });

  app.post("/token/delete", function (req, res) {
    token.tokenDelete(req, res);
  });

  app.post("/lotterydraw", function (req, res) {
    lottery.lotteryDraw(req, res);
  });

  app.post("/lotteryperiod", function (req, res) {
    lottery.lotteryPeriod(req, res);
  });

  app.post("/lastperiod", function (req, res) {
    lottery.lastPeriod(req, res);
  });
};
