const event = require("events")

class Message extends event {
  // 取得期數
  period(broadcast) {
    this.emit("period",broadcast)
  }

  // 關盤通知
  marketClose(broadcast) {
    this.emit("close", broadcast)
  }
}

const message = new Message();
module.exports = message;
