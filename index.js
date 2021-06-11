import express, { json } from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());
dayjs().format();
const chatMemory = fs.existsSync("./chatMemory.json")
? JSON.parse(fs.readFileSync("./chatMemory.json"))
: { participants: [], messages: [] };
let messages = chatMemory.messages;
let participants = chatMemory.participants;
//{from:,to:,text:,type:,time:}

app.post('/participants',(req,res) =>{

    let username = req.body.name;

    if(username !== "" || username !== null)
    {
        participants.name.includes(username) 
            ? 
            res.send("O nome do usuário já está em uso") 
            :
            sendMsgOfArrival(); 
            momentOfArrival = Date.now();
            participants.push({...req.body, "lastStatus": momentOfArrival});
            res.sendStatus(200);
    }
    else{
        res.sendStatus(400);
    }
})

function sendMsgOfArrival(req){
    messages.push({
        from: req.body.name, 
        to: 'Todos', 
        text: 'entra na sala...', 
        type: 'status', 
        time: 'HH:MM:SS'
    });
}

function sendMsgOfGetOut(participant) {
    messages.push({
        from: participant.name,
        to: "Todos",
        text: "sai da sala...",
        type: "status",
        time: dayjs().format("HH:mm:ss"),
    });
}


app.get('/participants',(req,res) => {
    if(participants.name.includes(req.headers.user)){
        res.send(participants);        
    }else{
        res.sendStatus(400);
    }
});

app.post('/messages',(req,res) =>{
    if(participants.name.includes(req.headers.user)){
        sendMessage(req);
        registerChatInfo();        
        res.sendStatus(200);
    }else{
        res.status(400).send("Houve um erro, tente novamente");
    }
})

function sendMessage(req) {
    messages.push({
        to: req.body.to,
        text: req.body.text,
        type: req.body.type,
        from: req.headers.user,
        time: dayjs().format("HH:mm:ss"),
    });
}

app.get('/messages',(req,res) => {

    const limit = parseInt(req.query.limit);
    if (participants.find((p) => p.name === req.headers.user)) {
        const filteredMessages = messages.filter((message) =>
                message.type === "message" ||
                message.to === "Todos" ||
                message.to === cleanUser ||
                message.from === cleanUser
        );
        if (typeof limit === "number") {
            filteredMessages.splice(0, filteredMessages.length - limit);
        }
        res.send(filteredMessages);
        saveData();
    } else {
        res.sendStatus(400);
    }
});

app.post('/status',(req,res) =>{
    participants.push(req.body);
    res.send();
})

function registerChatInfo() {
    fs.writeFileSync(
        "./data/chatData.json",
        JSON.stringify({ participants, messages })
    );
}

app.listen(4000);