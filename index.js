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
//{from:,to:,text:,type:,time:}

app.post('/participants',(req,res) =>{

    if(req.body.name !== "" || req.body.name !== null){
        {participants.name.includes(req.body.name) 
            ? 
            res.send("O nome do usuário já está em uso") 
            :
            sendMsgOfArrival(); 
            momentOfArrival = Date.now();
            participants.push({...req.body, "lastStatus": momentOfArrival});
            res.sendStatus(200);
        }
    }else{
        res.sendStatus(400);
    }
})

function sendMsgOfArrival(req){
    message = {from: req.body.name, to: 'Todos', text: 'entra na sala...', type: 'status', time: 'HH:MM:SS'};
    messages.push(messageOfArrival);
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
        res.send(messages);        
    }else{
        res.status(400).send("Houve um erro, tente novamente");
    }
})

app.get('/messages',(req,res) => {
    if(participants.name.includes(req.headers.user)){
        res.send(messages);        
    }else{
        res.status(400).send("Houve um erro, tente novamente");
    }
});

app.post('/status',(req,res) =>{
    participants.push(req.body);
    res.send();
})

app.listen(4000);