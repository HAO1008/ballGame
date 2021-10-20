## 插件
### 1、body-parser: 對post請求的請求體進行解析
### 2、cors: 後端解決跨域問題
### 3、express: node.js Web應用框架
### 4、moment: 輕量級js時間庫
### 5、mysql: 關聯式資料管理系統
### 6、nodemon: 監視node.js應用，更改並自動重啟服務
### 7、node-schedule: 定時任務
### 8、socket.io: 能使服務器與客戶端之間實現雙向通訊
### 9、uuid: 產生亂碼

## 資料夾
### 1、app.js - 啟動文件

### 2、config
  a、db.js - 資料庫

### 3、controll - 控制資料庫操作
  a、lottery 
  b、token
  c、users

### 4、dao
  a、dbserver.js - api撰寫
  b、runquery.js - promise格式
  c、socket.js - socket.io操作

### 5、event
  a、event.js - eventemitter

### 6、middleware
  a、middle.js - 中間件

### 7、router
  a、router.js - 路由

### 8、schedule
  a、close - 關盤通知
  b、created-lottery - 創建期數
  c、optimization-bonus.js - 兌獎
  d、optimization-draw - 開獎
  e、schedule.js - 排程
