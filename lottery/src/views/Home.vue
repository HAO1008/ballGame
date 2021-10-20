<template>
  <div class="home">
    <div class="broadcast" v-show="closeBet">
      {{ issue }}已關盤，請等待下一期
    </div>
    <div class="time">
      <h1>
        {{ localDate }}
        <span>上一次開獎期數:{{ lastIssue }}</span>
        <span>上一次開獎號碼:{{ lastNum.toString() }}</span>
        <span class="checkhistory">查看歷史開獎號碼</span>
      </h1>
    </div>
    <div class="area">
      <div class="user">
        <h1>使用者{{ nickname }}</h1>
        <h1>餘額 {{ balance }}</h1>
        <button @click="goRecord">下注紀錄</button>
      </div>
      <div class="bet-area">
        <div class="bet">
          <input
            type="number"
            v-for="(item, index) in betArr"
            :key="index"
            v-model="item.value"
            :min="min"
            :max="max"
          />
          <button @click="betNum">下注</button>
        </div>
        <div class="confirm">
          <h1>下注確認</h1>
          <h2>期數: {{ issue }}</h2>
          <div class="confirm-group">
            <div v-for="(item, index) in confirmBetArr" :key="index">
              {{ item.value }}
            </div>
          </div>
          <div class="button-group">
            <button @click="confirmNum">確定下注</button>
            <button @click="fixNum">修改</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { api } from "../../public/js/url";
import { parseDate } from "../../public/js/date";
// Socket
import io from "socket.io-client";
const socket = io("http://localhost:3000");

export default {
  name: "Home",
  data() {
    return {
      localDate: parseDate(new Date(), "YYYY-MM-DD HH:mm:ss"),
      timer: "",
      betArr: [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      confirmBetArr: [],
      issue: "",
      max: 30,
      min: 1,
      token: "",
      // 用戶資料
      nickname: "",
      balance: "",
      // 關盤
      closeBet: false,
      // 上一期
      lastIssue: "",
      lastNum: [],
    };
  },
  methods: {
    goRecord() {
      this.$router.push({ name: "Record" });
    },
    // 下注號碼
    betNum() {
      if (
        [...new Set(this.betArr.map((item) => item.value))].length <
        this.betArr.length
      ) {
        alert("有相同數字，請重新選擇");
        return;
      }
      for (let i = 0; i < this.betArr.length; i++) {
        if (this.betArr[i].value > 30 || this.betArr[i].value < 1) {
          alert("請輸入正確投注範圍");
          return;
        }
      }
      this.confirmBetArr = this.betArr;
    },
    // 下注確認
    confirmNum() {
      if (
        [...new Set(this.confirmBetArr.map((item) => item.value))].length <
        this.confirmBetArr.length
      ) {
        alert("有相同數字，請重新選擇");
        return;
      }
      if(this.confirmBetArr.length == 0) {
        alert("請輸入下注號碼")
        return
      }
      this.betInsert();
    },
    // 修改下注
    fixNum() {
      this.betArr = [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ];
      this.confirmBetArr = [];
    },
    // 獲取緩存數據
    getStorages() {
      const getData = localStorage.getItem("token");
      const getDataString = JSON.parse(getData);
      const store = getDataString[0];
      this.token = store.tokens;
      return {
        token: store.tokens,
      };
    },
    // 用戶資料
    async userData() {
      try {
        const res = await axios.post(api + "/token/userdata", {
          tokens: this.token,
        });
        const resData = res.data;
        const status = resData.status;
        if (status == 200) {
          this.balance = resData.result[0].balance;
          this.nickname = resData.result[0].nickname;
        }
      } catch (err) {
        alert(err);
        this.$router.push({ name: "Logout" });
      }
    },
    // 下注
    async betInsert() {
      try {
        const { token } = this.getStorages();
        const res = await axios.post(api + "/token/bet", {
          tokens: token,
          issue: this.issue,
          settle_n1: this.confirmBetArr[0].value,
          settle_n2: this.confirmBetArr[1].value,
          settle_n3: this.confirmBetArr[2].value,
          settle_n4: this.confirmBetArr[3].value,
          settle_n5: this.confirmBetArr[4].value,
        });
        const status = res.data.status;
        if (status == 200) {
          alert("下注成功");
          this.fixNum();
          this.userData();
          return;
        }
        if (status == 300) {
          alert("下注失敗");
          this.fixNum();
          return;
        }
        if (status == 400) {
          alert("token錯誤");
        }
      } catch (err) {
        alert(err);
        this.$router.push({ name: "Logout" });
      }
    },
    // 獲取期數
    async getPeriod() {
      try {
        const res = await axios.post(api + "/lotteryperiod", {
          status: 0,
        });
        const resData = res.data.data[0];
        const issue = resData.issue;
        const status = res.data.status;
        if (status == 200) {
          this.issue = issue;
        } else {
          alert("錯誤");
        }
      } catch (err) {
        alert(err);
        this.$router.push({ name: "Logout" });
      }
    },
    // 取得上一期得獎資訊
    async getLastPeriod() {
      try {
        const res = await axios.post(api + "/lastperiod", {
          status: 1,
        });

        const data = res.data.data[0];
        const status = res.data.status;
        if (status == 200) {
          this.lastIssue = data.issue;
          this.lastNum = [];
          this.lastNum.push(data.n1, data.n2, data.n3, data.n4, data.n5);
        }
      } catch (err) {
        alert(err);
        this.$router.push({ name: "Logout" });
      }
    },
    // socket連線
    socketGetLastPeriod() {
      socket.on("getLastPeriod", (e) => {
        this.getLastPeriod();
        this.getPeriod();
        this.closeBet = false;
        this.userData();
      });
    },
    socketGetClose() {
      socket.on("getClose", (broadcast) => {
        this.closeBet = true;
      });
    },
  },
  created() {
    this.timer = setInterval(() => {
      this.localDate = parseDate(new Date(), "YYYY-MM-DD HH:mm:ss");
    }, 1000);
    if (localStorage.getItem("token") == null) {
      console.log("請登入");
    } else {
      this.getStorages();
    }
    this.userData();
    this.getPeriod();
    this.getLastPeriod();
  },
  mounted() {
    this.socketGetLastPeriod();
    this.socketGetClose();
  },
};
</script>

<style lang="less" scoped>
.home {
  .broadcast {
    width: 100%;
    height: 100vh;
    background-color: #fff;
    color: #222;
    font-size: 26px;
    font-weight: bolder;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  .time {
    width: 60%;
    margin: 0 auto;
    padding: 35px;
    color: #fff;
    span {
      font-size: 16px;
      margin-left: 30px;
    }
    .checkhistory {
      background-color: rgb(218, 40, 40);
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
    }
  }
  .area {
    display: flex;
    align-items: center;
    justify-content: center;
    .user {
      width: 30%;
      height: 80vh;
      padding: 0px;
      background-color: rgba(255, 255, 255, 0.39);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      h1 {
        color: #fff;
      }
      button {
        margin-top: 12px;
        padding: 10px 20px;
        font-weight: bolder;
        color: #222;
        background-color: #fff;
        outline: none;
        border: 0;
        cursor: pointer;
      }
    }
    .bet-area {
      width: 70%;
      height: 80vh;
      background-color: #ffd180;
      .bet {
        width: 100%;
        height: 50%;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        input {
          width: 75px;
          height: 75px;
          border: 2px solid red;
          border-radius: 50%;
          margin-right: 20px;
          font-size: 20px;
          text-align: center;
          outline: none;
          background-color: #000;
          color: #fff;
        }
        button {
          margin-left: 20px;
          padding: 12px 15px;
          background-color: #222;
          color: #fff;
          border: 0;
          cursor: pointer;
        }
      }
      .confirm {
        width: 100%;
        height: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .confirm-group {
          display: flex;
          div {
            font-weight: bolder;
            font-size: 30px;
            margin: 10px 20px 30px 20px;
          }
        }
        .button-group {
          button {
            padding: 10px 15px;
          }
        }
      }
    }
  }
}
</style>
