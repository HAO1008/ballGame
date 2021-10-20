<template>
  <div class="about">
    <h1>Register</h1>
    <div class="input-group">
      <input v-model="nickname" type="text" placeholder="請輸入nickname" />
      <input v-model="account" type="text" placeholder="請輸入account" />
      <input v-model="password" type="password" placeholder="請輸入password" />
      <button @click="register">註冊</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { api } from "../../public/js/url";

export default {
  name: "Register",
  data() {
    return {
      nickname: "",
      account: "",
      password: "",
    };
  },
  methods: {
    async register() {
      try {
        const res = await axios.post(api + "/register", {
          account: this.account,
          password: this.password,
          nickname: this.nickname,
          balance: 1000
        });
        const status = res.data.status;
        if (status == 200) {
          alert("註冊成功");
          this.$router.push({ name: "Login" });
        } else {
          alert("註冊失敗");
          this.nickname = ""
          this.account = ""
          this.password = ""
        }
      } catch (err) {
        alert("註冊失敗");
        this.nickname = ""
        this.account = ""
        this.password = ""
      }
    },
  },
};
</script>

<style lang="less" scoped>
.about {
  h1 {
    margin-bottom: 50px;
  }
  .input-group {
    margin: 0 auto;
    width: 30%;
    display: flex;
    flex-direction: column;
    input {
      height: 30px;
      margin-bottom: 20px;
    }
    button {
      height: 30px;
      cursor: pointer;
    }
  }
}
</style>
