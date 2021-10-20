## 投注遊戲

# 介紹
1、彩球 1~30，共 30 個號碼
2、每期開 5 個號碼，號碼不重複

# 開獎時間
1、每天 24 小時開獎不間斷，每 10 分鐘開一次獎
2、開獎前 1 分鐘不得購買

# 玩法
1、任選 5 個號碼，不分順序，每次購買限制 50 點
 
# 中獎規則
中 5 個號碼， 1000 倍 獎金
中 4 個號碼， 500 倍 獎金
中 3 個號碼， 5 倍 獎金
中 2 個號碼， 1 倍 獎金
玩家中獎金額計算方式:購買點數(50 點) x 倍數
ex. 中 3 個號碼，獎金為:50(點) x5(倍) = 250 (點

# 系統需求
1、開獎
  a、彩球結果的每個號碼不得重覆出現
  b、每十分鐘開一次獎，就算沒有人購買也要開獎
  c、每次開獎的結果必須記錄起來
2、玩家
  a、玩家註冊固定送1000點
  b、必須記錄玩家的購買紀錄(下了什麼號碼、哪個期數、中獎結果)
3、購買
  a、玩家只能單次購買單張，但同一期可以購買多張單
  b、購買時會扣掉玩家的點數，若點數不足額，不可以購買
4、兌獎
  a、該期中獎金額產出後，可立即計算玩家購買的單是否有中獎
  b、兌獎後須將對應獎金加進玩家的餘額


## 插件
1、body-parser: 對post請求的請求體進行解析
2、cors: 後端解決跨域問題
3、express: node.js Web應用框架
4、moment: 輕量級js時間庫
5、mysql: 關聯式資料管理系統
6、nodemon: 監視node.js應用，更改並自動重啟服務
7、node-schedule: 定時任務
8、socket.io: 能使服務器與客戶端之間實現雙向通訊
9、uuid: 產生亂碼

## 資料夾
1、app.js - 啟動文件

2、config
  a、db.js - 資料庫

3、controll - 控制資料庫操作
  a、lottery 
  b、token
  c、users

4、dao
  a、dbserver.js - api撰寫
  b、runquery.js - promise格式
  c、socket.js - socket.io操作

5、event
  a、event.js - eventemitter

6、middleware
  a、middle.js - 中間件

7、router
  a、router.js - 路由

8、schedule
  a、close - 關盤通知
  b、created-lottery - 創建期數
  c、optimization-bonus.js - 兌獎
  d、optimization-draw - 開獎
  e、schedule.js - 排程
