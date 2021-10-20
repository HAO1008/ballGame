<template>
  <div id="app">
    <div id="nav">
      <router-link to="/Home">Home</router-link> |
      <router-link v-if="flag" to="/">Login</router-link>
      <a v-else @click="remove">Logout</a>
    </div>
    <router-view />
  </div>
</template>

<script>
import axios from "axios";
import { api } from "../public/js/url";

export default {
  data() {
    return {
      flag: true,
      user_id: "",
      token: "",
    };
  },
  methods: {
    // 獲取緩存數據
    getStorages() {
      const getData = localStorage.getItem("token");
      const getDataString = JSON.parse(getData);
      const store = getDataString[0];
      this.token = store.tokens
      this.user_id = store.user_id;
    },
    // 移除token
    async remove() {
      try {
        const res = await axios.post(api + "/token/delete", {
          tokens: this.token
        });
        localStorage.removeItem("token");
        this.$router.push({ name: "Logout" });
        location.reload();
      } catch (err) {
        alert(err);
      }
    },
  },
  created() {
    if (localStorage.getItem("token") == null) {
      console.log("請登入");
    } else {
      this.getStorages();
    }
  },
  mounted() {
    if (localStorage.getItem("token") != null) {
      this.flag = false;
    } else {
      this.flag = true;
    }
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #222;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #fff;
    cursor: pointer;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
