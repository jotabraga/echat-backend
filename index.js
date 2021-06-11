import express, { json } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const participants = [];
const messages = [{from:,to:,text:,type:,time:}];

app.post('/participants',(req,res) =>{
    {participants.includes(req.body.name) 
        ? 
        res.send("O nome do usuário já está em uso") 
        :
        momentOfArrival = Date.now();
        participants.push({...req.body, "lastStatus": momentOfArrival});
        res.send();
    }
})

app.get('/participants',(req,res) => {
    res.send(posts.find((post) => post.id == postId));
});

app.post('/messages',(req,res) =>{
    participants.push(req.body);
    res.send();
})

app.get('/messages',(req,res) => {
    const postId = req.params.id;
    res.send(posts.find((post) => post.id == postId));
});

app.post('/status',(req,res) =>{
    participants.push(req.body);
    res.send();
})

app.listen(4000);