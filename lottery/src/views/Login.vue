<template>
  <div class="about">
    <h1>Login</h1>
    <div class="input-group">
      <input v-model="account" type="text" placeholder="請輸入account" />
      <input v-model="password" type="password" placeholder="請輸入password" />
      <button @click="login">登入</button>
      <h2>沒有帳號嗎，<span @click="goRegister">請點我註冊</span></h2>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { api } from "../../public/js/url";

export default {
  name: "Login",
  data() {
    return {
      account: "",
      password: "",
      token: "",
      user_id: "",
    };
  },
  methods: {
    goRegister() {
      this.$router.push({ name: "Register" });
    },
    async login() {
      try {
        const res = await axios.post(api + "/login", {
          account: this.account,
          password: this.password,
        });
        const resData = res.data;
        const status = resData.status;
        const token = resData.token;
        if (status == 200) {
          const store = [
            {
              user_id: resData.data[0].id,
              tokens: token,
            },
          ];
          const storeString = JSON.stringify(store);
          localStorage.setItem("token", storeString);
          this.$router.push({ name: "Home" });
          location.reload();
        } else if (status == 300) {
          alert("帳號或密碼錯誤")
          this.account = "";
          this.password = "";
        } else {
          alert("token錯誤");
          this.account = "";
          this.password = "";
        }
      } catch (err) {
        alert(err);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.about {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .input-group {
    margin: 50px auto;
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
    h2 {
      margin-top: 50px;
      span {
        cursor: pointer;
        color: rgb(0, 0, 110);
        text-decoration: underline;
      }
    }
  }
}
</style>
