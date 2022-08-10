const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
// db connection
mongoose.connect("mongodb://localhost:27017/chat-socket", (err) => { 
  if (err) {
    console.log(err);
  } else {
    console.log("Db connected...");
  }
});

const Message = mongoose.model("Message", { name: String, message: String });

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", (req, res) => {
  const message = new Message(req.body);
  message.save((err) => {
    if (err) sendStatus(500);
    io.emit("message", req.body);
    res.sendStatus(200);
  });
});

io.on("connection", () => {
  console.log("a user is connected");
});

const server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
  });
