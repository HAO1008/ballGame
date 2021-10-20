const { runQuery } = require("../dao/runquery");

// 新建資料表
async function updateGain(issue, multiple, id, user_id) {
  try {
    const price = 50 * multiple;
    const now = new Date();
    const temporaryInsert = `
        INSERT INTO 
          fictitious
        (id, user_id, issue, status, gain_amount, balance, updated_at) 
        VALUES
        (?, ?, ?, ?, ?, ?, ?)
      `;
    const temporaryInsertParams = [id, user_id, issue, 1, price, price, now];
    const temporaryInsertData = await runQuery(
      temporaryInsert,
      temporaryInsertParams
    );
  } catch (err) {
    console.log(err);
  }
}

exports.bonus = async function(){
  try {
    const historySelect = "SELECT * FROM settle_history WHERE status = ?";
    const data = await runQuery(historySelect, [0]);
    let issue = [];
    for (let i = 0; i < data.length; i++) {
      if (issue.indexOf(data[i].issue) < 0) {
        issue.push(data[i].issue);
      }
    }
    if(data.length == 0) {
      console.log("沒有兌獎號碼");
      return
    }
    const issueSelect = `
                  SELECT 
                    issue, n1, n2, n3, n4, n5 FROM lottery_issues 
                  WHERE 
                    issue IN (${issue}) 
                  AND 
                    status = 1
                `;
    const result = await runQuery(issueSelect);
    const temporaryCreate = `
        CREATE TEMPORARY TABLE 
          fictitious
          (id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
          user_id INT(10) NOT NULL, 
          issue BIGINT(20) NOT NULL, 
          status TINYINT(3) NOT NULL, 
          gain_amount INT(10) NOT NULL, 
          balance INT(10) NOT NULL, 
          updated_at DATETIME)
      `;
    const temporaryCreateData = await runQuery(temporaryCreate);
    let map = new Map();
    for (let i = 0; i < result.length; i++) {
      map.set(result[i].issue, [
        result[i].n1,
        result[i].n2,
        result[i].n3,
        result[i].n4,
        result[i].n5,
      ]);
    }
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const id = item.id;
      const issue = item.issue;
      const user_id = item.user_id;
      let bonus = map.get(issue);
      const bet = [
        item.settle_n1,
        item.settle_n2,
        item.settle_n3,
        item.settle_n4,
        item.settle_n5,
      ];
      const pool = (bonus || []).filter((val) => {
        return bet.indexOf(val) != -1;
      });
      if (pool.length == 5) {
        console.log("1000倍");
        updateGain(issue, 1000, id, user_id);
      }
      if (pool.length == 4) {
        console.log("500倍");
        updateGain(issue, 500, id, user_id);
      }
      if (pool.length == 3) {
        console.log("5倍");
        updateGain(issue, 5, id, user_id);
      }
      if (pool.length == 2) {
        console.log("2倍");
        updateGain(issue, 2, id, user_id);
      }
      if (pool.length < 2) {
        console.log("未中獎");
        updateGain(issue, 0, id, user_id);
      }
    }
    const gainUpdate = `
        UPDATE 
          settle_history INNER JOIN
        (SELECT * FROM fictitious) 
          gather ON settle_history.id = gather.id 
        SET 
          settle_history.gain_amount = gather.gain_amount,
          settle_history.status = gather.status,
          settle_history.updated_at = gather.updated_at
      `;
    const gainUpdateData = await runQuery(gainUpdate);
    const balanceUpdate = `
        UPDATE 
          users INNER JOIN
        (SELECT 
          SUM(balance) AS total, 
          updated_at, 
          user_id 
          FROM fictitious 
        GROUP BY 
          user_id) 
        gather ON 
          users.id = gather.user_id 
        SET 
          users.balance = users.balance + total,
          users.updated_at = gather.updated_at
      `;
    const balanceUpdateData = await runQuery(balanceUpdate);
    map.clear()
    const temporaryDrop = "DROP TABLE fictitious"
    const temporaryDropData = await runQuery(temporaryDrop)
    console.log("兌獎成功");
  } catch (err) {
    console.log(err);
  }
}