const bodyParser = require("body-parser");
const cors = require("cors");
const middle = require("./middleware/middle");

const express = require("express");
const app = express();
const port = 3000;

app.use(middle.corsFunc);

const httpServer = require("http").Server(app);
const io = require("socket.io")(httpServer, {
  cors: true,
});

require("./dao/socket")(io);

app.use(bodyParser.json());

app.use("/token", middle.inspect);

require("./router/index")(app);

app.use(middle.errIndex);

httpServer.listen(port, () => console.log(`server is running on port ${port}`));
