const { runQuery } = require("../dao/runquery");

// event
const message = require("../event/event");

// 產生亂碼
function randomNum(shuffle) {
  for (let i = 0; i < shuffle.length; i++) {
    let random = Math.floor(Math.random() * shuffle.length);
    let temp = shuffle[i];
    shuffle[i] = shuffle[random];
    shuffle[random] = temp;
  }
  shuffle = shuffle.slice(0, 5);
  return { shuffle };
}

let arr = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30,
];

// 開獎
exports.draw = async function() {
  try {
    let arr2 = arr.slice(0);
    const status = 1;
    const now = new Date();
    const sql =`
      SELECT 
        open_at, close_at, issue 
      FROM 
        lottery_issues 
      WHERE 
        close_at < ? 
      AND 
        status = ?
    `;
    const sqlParams = [now, 0];
    const data = await runQuery(sql, sqlParams);
    let issue = [];
    for (let i = 0; i < data.length; i++) {
      if (issue.indexOf(data[i].issue) < 0) {
        issue.push(data[i].issue);
      }
    }
    if (issue.length == 0) {
      console.log("沒有可開獎號碼");
      return;
    }
    const temporaryCreate = `
      CREATE TEMPORARY TABLE 
        virtual
        (
          issue bigint(20) PRIMARY KEY,
          n1 tinyint(3) NOT NULL,
          n2 tinyint(3) NOT NULL,
          n3 tinyint(3) NOT NULL,
          n4 tinyint(3) NOT NULL,
          n5 tinyint(3) NOT NULL,
          status tinyint(3),
          updated_at datetime
        )
      `;
    const temporaryCreateData = await runQuery(temporaryCreate);
    const shuffleArr = []
    for (let i = 0; i < issue.length; i++) {
      const { shuffle } = randomNum(arr2);
      const n1 = shuffle[0];
      const n2 = shuffle[1];
      const n3 = shuffle[2];
      const n4 = shuffle[3];
      const n5 = shuffle[4];
      shuffleArr.push([issue[i], n1, n2, n3, n4, n5, 1, now])
    }
    const temporaryInsert = `
      INSERT INTO 
        virtual
      (issue, n1, n2, n3, n4, n5, status, updated_at)
      VALUES ?
    `
    const temporaryParams = [shuffleArr];
    const temporaryData = await runQuery(temporaryInsert, temporaryParams);

    const temporaryJoin = `
      UPDATE 
        lottery_issues 
      INNER JOIN 
        (SELECT * FROM virtual) 
      gather ON 
        lottery_issues.issue = gather.issue 
      SET 
        lottery_issues.n1 = gather.n1, 
        lottery_issues.n2 = gather.n2, 
        lottery_issues.n3 = gather.n3, 
        lottery_issues.n4 = gather.n4, 
        lottery_issues.n5 = gather.n5, 
        lottery_issues.status = gather.status, 
        lottery_issues.updated_at = gather.updated_at
    `;
    const temporaryJoinData = await runQuery(temporaryJoin);
    const temporaryDrop = "DROP TABLE virtual";
    const temporaryDropData = await runQuery(temporaryDrop);
    const broadcast = "本期開獎成功";
    message.period(broadcast);
  } catch (err) {
    console.log(err);
  }
};

// const lotteryInsert =
//   "INSERT INTO lottery_issues(issue, n1, n2, n3, n4, n5, status, updated_at) SELECT * FROM virtual ON DUPLICATE KEY UPDATE lottery_issues.issue = virtual.issue, lottery_issues.n1 = virtual.n1, lottery_issues.n2 = virtual.n2, lottery_issues.n3 = virtual.n3, lottery_issues.n4 = virtual.n4, lottery_issues.n5 = virtual.n5, lottery_issues.status = virtual.status, lottery_issues.updated_at = virtual.updated_at";
// const lotteryInsertData = await runQuery(lotteryInsert);
// const temporaryDrop = "DROP TABLE virtual"
// const temporaryDropData = await runQuery(temporaryDrop)