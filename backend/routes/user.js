var express = require("express")
const fs = require("fs")

var {User} = require("./../model/user")
var uploadFile = require("./../middleware/upload")
var checkAuth = require("./../middleware/check-auth")

var router = express.Router()

router.route('/user/:token')
    .get(checkAuth,async function(request,response) {
        var user = request.user;
        user.avatar = "http://localhost:8080/" + user.avatar
        response.status(201).json(user)
    });
router.route('/users')
    .get(async function(request,response) {
            var users = await User.find();
            users.map(user=>{
                user.avatar = "http://localhost:8080/" + user.avatar
            });
            response.status(200).json({users})
    });
router.route('/user/create')
    .post(uploadFile, async function(request,response){
        var body = request.body;
        
        var newUser = new User({
            login: body.login,
            password: await User.generateHash(body.password),
            username: body.username,
            avatar: request.file.filename,
            ontime: body.ontime
        })
 
        newUser.save().then((res)=>{
            var token = User.generateAuthToken(res)
            response.status(200).json({token})
        }).catch((e)=>{
            console.log(e);
            response.status(400).json()
        })


    });
router.route('/user/login')
    .post(async function(request,response) {
        var user = {
            login: request.body.login,
            password: request.body.password,
        }
        // console.log(user);
        
        User.findOne({login: user.login}).then(async function(res){
            if(!res){
               response.status(404).json()
            }

            // console.log(await User.comparePas(user.password,res.password));
            if( await User.comparePas(user.password,res.password) ){
                var token = User.generateAuthToken(res)
                response.status(200).json({token})
            }
            else{
                response.status(404).json()
            }
        }).catch((e)=>{
            console.log(e);
            response.status(404).json()
        })
        
    });
router.route('/user/informations/:token')
    .patch(checkAuth, uploadFile, async function(request,response) {
        var body = request.body;
         
        if( body.mode === "info" ){
            var updUser = {
                login: body.login,
                // password: await User.generateHash(body.password),
                username: body.username,
                status: body.status
            }
            if(request.file){
                updUser.avatar = request.file.filename;
            }
            User.findByIdAndUpdate(request.user._id,{$set:updUser},{new: true}).then((res)=>{
                if(!res){
                    response.status(404).json()
                }
                
                var token = User.generateAuthToken(res)
                response.status(200).json({token})
                
            }).catch((e)=>{
                console.log(e);
                response.status(404).json()
            })
        }
        else if( body.mode === "pass" ){
            
            
            var updUser = {
                current: body.currentPass,
                new: body.newPass,
            }

            var a = await User.comparePas(updUser.current,request.user.password); 
            if( a ){
                var newPass = await User.generateHash(updUser.new);
                User.findByIdAndUpdate(request.user._id,{$set:{password: newPass}},{new: true}).then((res)=>{
                    if(!res){
                        response.status(404).json()
                    }
                
                    var token = User.generateAuthToken(res)
                    response.status(200).json({token})
                })
            }else{
                response.status(400).json()
            }
        }
        else{
            response.status(400).json()
        }

    });
router.route('/user/:token')
    .delete( checkAuth, async function(request,response) {
        var user = request.user;
        fs.unlink(__dirname + "/../uploads/" + user.avatar)
        await User.findByIdAndRemove(user._id).then((res)=>{
            if(!res){
                response.status(404).json()
            }
            
            response.status(200).json()
        })
    });
router.route('/set/time/:token')
    .post( checkAuth, async function(request,response) {
        var user = request.user;
        var time = request.body.time;

        User.findByIdAndUpdate(user._id,{$set:{ontime: time}}).then((res)=>{
            if(!res){
                response.status(404).json()
            }

            response.status(200).json()
        }).catch((e)=>{
            console.log(e);
            response.status(400).json()
        })
    } );

module.exports = router