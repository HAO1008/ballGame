<template>
  <div class="record">
    <h1>紀錄</h1>
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>姓名</th>
          <th>期數</th>
          <th>第一球</th>
          <th>第二球</th>
          <th>第三球</th>
          <th>第四球</th>
          <th>第五球</th>
          <th>狀況</th>
          <th>金額</th>
          <th>獲得金額</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in record" :key="index">
          <td>{{ item.user_id }}</td>
          <td>name</td>
          <td>{{ item.issue }}</td>
          <td>{{ item.settle_n1 }}</td>
          <td>{{ item.settle_n2 }}</td>
          <td>{{ item.settle_n3 }}</td>
          <td>{{ item.settle_n4 }}</td>
          <td>{{ item.settle_n5 }}</td>
          <td v-if="item.status == 1">已開獎</td>
          <td v-else>未開獎</td>
          <td>{{ item.settle_amount }}</td>
          <td>{{ item.gain_amount }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { api } from "../../public/js/url";

export default {
  name: "Record",
  data() {
    return {
      token: "",
      record: {},
      price: {},
      bet: {},
      pool: [],
    };
  },
  methods: {
    // 獲取緩存數據
    getStorages() {
      const getData = localStorage.getItem("token");
      const getDataString = JSON.parse(getData);
      const store = getDataString[0];
      this.token = store.tokens;
    },
    // 取得紀錄
    async getRecord() {
      try {
        const res = await axios.post(api + "/token/record", {
          tokens: this.token,
        });
        const resData = res.data;
        const status = resData.status;
        if (status == 200) {
          this.record = resData.result;
        }
      } catch (err) {
        alert(err);
        this.$router.push({ name: "Logout" });
      }
    },
  },
  created() {
    this.getStorages();
    this.getRecord();
  },
};
</script>

<style lang="less" scoped>
.record {
  width: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  table {
    // border: 2px solid #222;
    box-shadow: 3px 10px 10px rgba(34, 34, 34, 0.5);
    width: 90%;
    th {
      background-color: slategray;
      color: #fff;
      padding: 10px;
      font-weight: 700;
    }
    tr {
      color: rgb(139, 139, 139);
      td {
        padding: 10px;
      }
    }
  }
}
</style>
