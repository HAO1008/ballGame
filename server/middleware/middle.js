const { runQuery } = require("../dao/runquery");
const cors = require("cors");

exports.inspect = async function (req, res, next) {
  try {
    const sql = "SELECT * FROM tokens where tokens = ?";
    const sqlParams = [req.body.tokens];
    const middleData = await runQuery(sql, sqlParams);
    req.id = middleData[0].user_id;
    next();
  } catch (err) {
    res.send({ status: 400 });
  }
};

exports.corsFunc = cors({
  origin: ["http://localhost:8080"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
})

exports.errIndex = function (req, res, next) {
  const err = new Error("not Found");
  err.status = 404;
  next()
}