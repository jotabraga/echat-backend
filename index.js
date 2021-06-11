import express, { json } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const participants = [{name:,lastStatus:}];
const messages = [{from:,to:,text:,type:,time:}];


app.get('/posts/',(req,res) => {
    const postId = req.params.id;
    res.send(posts.find((post) => post.id == postId));
});


app.post('/new-story',(req,res) =>{
    const newId = (posts[posts.length-1].id + 1);
    posts.push({...req.body, "id":newId});
    res.send();
})



app.listen(4000);