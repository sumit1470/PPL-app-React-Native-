const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const DIR = './Uploads';

const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, DIR);
    },
    filename: (req,file,cb) =>{
        const fileName = file.originalname + "-" + Date.now();
        cb(null,fileName);
    }
})

let upload = multer({
    storage: storage
    // dest: 'uploads/'
})

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.post("/uploadpost",upload.single('image'),(req,res)=>{
    console.log("Request file in /uploadpost: "+JSON.stringify(req.file));
    console.log("Request body in /uploadpost: "+JSON.stringify(req.body));
})

app.listen("3030",()=>{console.log("Server 3030 is running")});