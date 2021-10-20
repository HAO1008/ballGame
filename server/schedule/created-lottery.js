const { runQuery } = require("../dao/runquery");
const moment = require("moment");

async function lotteryCreated() {
  try {
    const today = moment().startOf("day"); //獲取今天時間
    const todayStamp = moment().unix(); //獲取今天時間戳
    const lastDay = moment().endOf("month"); //獲取本月最後一天時間
    const lastDayStamp = moment(lastDay).unix(); //獲取本月最後一天時間戳
    const sub = lastDayStamp - todayStamp;
    const floorSub = Math.floor(sub / 600);

    const dataArr = [];
    for (let i = 0; i < 1000; i++) {
      const spacing = moment(today).add(10 * i, "minute");
      const formatSpacing = moment(spacing).format("YYYYMMDDHHmm"); //把時間格式化
      const issue = formatSpacing;
      const open_at = moment(spacing).format(); //獲取spacing的時間格式
      const closeSpacing = moment(open_at).add(9, "minute");
      const close_at = moment(closeSpacing).format();
      const now = new Date();
      dataArr.push([issue, open_at, close_at, 0, now, now]);
    }
    const batchInsert =
      "INSERT INTO lottery_issues(issue, open_at, close_at, status, updated_at, created_at) VALUES ?";
    const batchInsertParams = [dataArr];
    const batchInsertData = await runQuery(batchInsert, batchInsertParams);
  } catch (err) {
    console.log(err);
  }
}

lotteryCreated();
