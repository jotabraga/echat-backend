import express, { json } from "express";
import cors from "cors";
import dayjs from "dayjs";
import fs from "fs";
import Joi from "joi";

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
  const nickname = req.body;
  if (dataValidate(nickname, "nickName")) {
    res.sendStatus(400);
  } else {
    const treatedName = stringTreatment(nickname.name);
    participants.find((n) => n.name === treatedName)
      ? res.send("O nome do usuário já está em uso")
      : () => {
          sendMsgOfArrival(treatedName);
          const momentOfArrival = Date.now();
          participants.push({ ...req.body, lastStatus: momentOfArrival });
          registerChatInfo();
          res.sendStatus(200);
        };
  }
});

function stringTreatment(string) {
  return string.replace(/<|>/g, "").trim();
}

function dataValidate(data, type) {
  switch (type) {
    case "username": {
      const schema = Joi.object({
        user: Joi.string().replace(/<|>/g, "").required().trim(),
      }).unknown(true);
      const error = schema.validate(data).error;
      return error ? true : false;
    }
    case "nickName": {
      const schema = Joi.object({
        name: Joi.string().replace(/<|>/g, "").required().trim(),
      }).unknown(true);
      const error = schema.validate(data).error;
      return error ? true : false;
    }
    case "message": {
      const schema = Joi.object({
        to: Joi.string().replace(/<|>/g, "").required().trim(),
        text: Joi.string().replace(/<|>/g, "").required().trim(),
        type: Joi.string()
          .pattern(new RegExp(/(^message$|^private_message$)/))
          .required(),
      });
      const error = schema.validate(data).error;
      return error ? true : false;
    }
  }
}

function sendMsgOfArrival(nickName) {
  messages.push({
    from: nickName,
    to: "Todos",
    text: "entra na sala...",
    type: "status",
    time: dayjs().format("HH:mm:ss"),
  });
}

function sendMsgOfGetOut(nickName) {
  messages.push({
    from: nickName.name,
    to: "Todos",
    text: "sai da sala...",
    type: "status",
    time: dayjs().format("HH:mm:ss"),
  });
}

app.get("/participants", (req, res) => {
  const nickname = req.body;
  if (dataValidate(nickname, "nickName")) {
    res.sendStatus(400);
  } else {
    res.send(participants);
  }
});

app.post("/messages", (req, res) => {
  const userMessage = req.body;
  const nickName = req.headers;

  if (
    dataValidate(userMessage, "message") ||
    dataValidate(nickName, "username")
  ) {
    res.sendStatus(400);
  } else {
    const treatedName = stringTreatment(nickName.User);
    if (participants.find((n) => n.name === treatedName)) {
      sendMessage(req);
      registerChatInfo();
      res.sendStatus(200);
    }
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
  const nickName = req.headers;
  if (dataValidate(nickName, "username")) {
    res.sendStatus(400);
  } else {
    const treatedName = stringTreatment(nickName.User);
    const limitOfMessagesRender = parseInt(req.query.limit);

    if (participants.find((p) => p.name === treatedName)) {
      const userMessages = messages.filter(
        (message) =>
          message.type === "message" ||
          message.to === "Todos" ||
          message.to === cleanUser ||
          message.from === cleanUser
      );

      userMessages.splice(-limitOfMessagesRender);

      res.send(userMessages);
      registerChatInfo();
    } else {
      res.sendStatus(400);
    }
  }
});

app.post("/status", (req, res) => {
  const participant = participants.find((p) => p.name === req.get("User"));
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
            sendMsgOfGetOut(p);
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
