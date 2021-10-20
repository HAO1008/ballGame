module.exports = function (io) {
  console.log("socket連線成功");
  
  // 排程 
  const schedule = require("../schedule/schedule")

  // event.js
  const message = require("../event/event");

  // 取得期數資訊
  message.on("period", (broadcast) => {
    console.log(broadcast);
    io.emit("getLastPeriod", broadcast)
  })

  // 關盤通知
  message.on("close", (broadcast) => {
    io.emit("getClose", broadcast)
  })
};
