const { runQuery } = require("../dao/runquery");

// event
const message = require("../event/event");

exports.closeMarket = async function () {
  const now = new Date();
  const sql =
    "SELECT issue,open_at,close_at FROM lottery_issues WHERE close_at > ? AND status = ? LIMIT 1";
  const sqlParams = [now, 0];
  const data = await runQuery(sql, sqlParams);
  if (now < data[0].open_at) {
    const sql1 =
      "SELECT issue,open_at,close_at FROM lottery_issues WHERE close_at < ? AND status = ? ORDER BY issue DESC LIMIT 1";
    const sqlParams1 = [now, 0];
    const result = await runQuery(sql1, sqlParams1);
    message.marketClose(result[0].issue);
    return;
  }
  message.marketClose(data[0].issue);
};
