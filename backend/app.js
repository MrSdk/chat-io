const cors = require("cors")
const bodyParser = require("body-parser")
const express = require("express")
const path = require("path")
const multer = require("multer")
const mkdirp = require("mkdirp")

mkdirp.sync(__dirname + "/uploads")

var app = express()
var router = express.Router();

var UserRouter = require("./routes/user")
var ChatRouter = require("./routes/chat")
var UserMsgRouter = require("./routes/user-msg")
// Online Chat in your Browser
app.use(express.static(path.join(__dirname + "/uploads")))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use('/',router)
app.use('/',UserRouter)
app.use('/',ChatRouter)
app.use('/',UserMsgRouter)

router.route('/')
    .get((req,res)=>{
        res.send("MR_SDK")
    });

module.exports = app