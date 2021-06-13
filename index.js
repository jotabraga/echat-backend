import express, { json } from "express";
import cors from "cors";
import dayjs from "dayjs";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());
dayjs().format();
const chatMemory = fs.existsSync("./chatMemory.json")
  ? JSON.parse(fs.readFileSync("./chatMemory.json"))
  : { participants: [], messages: [] };
let messages = chatMemory.messages;
let participants = chatMemory.participants;


app.post("/participants", (req, res) => {
  const nickname = req.body.name;
  
  if (verifyData(nickname)) {        
    if(participants.find((n) => n.name === nickname)){
      res.send("O nome do usuário já está em uso")
    }else{
      addParticipant(nickname);
      registerChatInfo();
      res.sendStatus(200);
    }      
  } else {
    res.sendStatus(400);
  }
});

function addParticipant(nickname) {
  participants.push({
      name: nickname,
      lastStatus: Date.now(),
  });
  messages.push({
      from: nickname,
      to: "Todos",
      text: "entra na sala...",
      type: "status",
      time: dayjs().format("HH:mm:ss"),
  });
}

function verifyData(data) {
  if (typeof data == "string" && data !== "" && data !== null) {
    return true;
  } else {
    return false;
  }
}


function sendMsgOfGetOut(nickName) {
  messages.push({
    from: nickName,
    to: "Todos",
    text: "sai da sala...",
    type: "status",
    time: dayjs().format("HH:mm:ss"),
  });
}

app.get("/participants", (req, res) => {
  res.send(participants);
});

app.post("/messages", (req, res) => {
  const userMessage = req.body.text;

  if (dataValidate(userMessage)) {
    const nickName = req.get("user");

    if (participants.find((n) => n.name === nickName)) {
      sendMessage(req);
      registerChatInfo();
      res.sendStatus(200);
    }
  } else {
    res.sendStatus(400);
  }
});

function sendMessage(req) {
  messages.push({
    to: req.body.to,
    text: req.body.text,
    type: req.body.type,
    from: req.headers.User,
    time: dayjs().format("HH:mm:ss"),
  });
}

app.get("/messages", (req, res) => {
  const limitOfMessagesRender = parseInt(req.query.limit);

  if (participants.find((p) => p.name === req.get("user"))) {

    let userMessages = messages.filter(
      (message) =>
        message.type === "message" ||
        message.to === "Todos" ||
        message.to === req.get("user") ||
        message.from === req.get("user")
    );
    
    if (limitOfMessagesRender) {
      userMessages = userMessages.splice(-limitOfMessagesRender);
    }
    res.send(userMessages);
    registerChatInfo();
  } else {
    res.sendStatus(400);
  }
});

app.post("/status", (req, res) => {
  const participant = participants.find((p) => p.name === req.get("user"));
  if (participant) {
    participant.lastStatus = Date.now();
    res.sendStatus(200);
    registerChatInfo();
  } else {
    res.sendStatus(400);
  }
});

function removeTheInactiveUsers() {
  setInterval(() => {
    participants = participants.filter((p) => {
      Date.now() - p.lastStatus > 10000
        ? (p) => {
            sendMsgOfGetOut(p.name);
            return false;
          }
        : () => {
            return true;
          };
    });
    registerChatInfo();
  }, 15000);
}

function registerChatInfo() {
  fs.writeFileSync(
    "./chatMemory.json",
    JSON.stringify({ participants, messages })
  );
}

removeTheInactiveUsers();

app.listen(4000, () => {
  console.log("Jota server online");
});

// function stringTreatment(word) {
//   return word.replace(/<|>/g, "").trim();
// }

// function dataValidate(data, type) {
//   switch (type) {
//     case "username": {
//       const schema = Joi.object({
//         user: Joi.string().replace(/<|>/g, "").required().trim(),
//       }).unknown(true);
//       const error = schema.validate(data).error;
//       return error ? true : false;
//     }
//     case "nickName": {
//       const schema = Joi.object({
//         name: Joi.string().replace(/<|>/g, "").required().trim(),
//       }).unknown(true);
//       const error = schema.validate(data).error;
//       return error ? true : false;
//     }
//     case "message": {
//       const schema = Joi.object({
//         to: Joi.string().replace(/<|>/g, "").required().trim(),
//         text: Joi.string().replace(/<|>/g, "").required().trim(),
//         type: Joi.string()
//           .pattern(new RegExp(/(^message$|^private_message$)/))
//           .required(),
//       });
//       const error = schema.validate(data).error;
//       return error ? true : false;
//     }
//   }
// }
