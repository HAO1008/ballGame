const schedule = require("node-schedule");
const lotteryDraw = require("./optimization-draw");
const bonus = require("./optimization-bonus")
const closeMarket = require("./close");

const rule = new schedule.RecurrenceRule();
rule.minute = [0, 10, 20, 30, 40, 50]; //每10分鐘觸發一次
const job = schedule.scheduleJob(rule, () => {
  lotteryDraw.draw();
  setTimeout(() => {
    bonus.bonus()
  }, 100);
});

const rule2 = new schedule.RecurrenceRule();
rule2.minute = [9, 19, 29, 39, 49, 59]; //每分鐘第9分觸發
const close = schedule.scheduleJob(rule2, () => {
  closeMarket.closeMarket();
});
