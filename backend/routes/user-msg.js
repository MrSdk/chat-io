const express = require("express")
const localEvent = require("./../utils/localEvent")

var {UserMessage} =require("./../model/user-msg")
var checkAuth = require("./../middleware/check-auth")
var router = express.Router()
 
router.route('/user_message/:token/:user_id')
    .post( checkAuth, async function(request,response){
        var userMsg = {
            user1: request.user._id,
            text1: request.body.text,
            user2: request.params.user_id,
            date: request.body.date
        }
        
        newUserMsg = new UserMessage(userMsg)

        newUserMsg.save().then(async (res)=>{

            var thisMessages = [];
            var allMsges = await UserMessage.find();
            allMsges.map( (msg) => {
                if( (msg.user1 === userMsg.user1 && msg.user2 === userMsg.user2) || (msg.user1 === userMsg.user2 && msg.user2 === userMsg.user1)  ){
                    thisMessages.push(msg)
                }
            } )

            localEvent.emit('userMessages', thisMessages.length )
            response.status(200).json()
        }).catch((e)=>{
            console.log(e);
            response.status(400).json()
        })
    })
    .patch( checkAuth, async function(request,response){
        var body = {
            message: request.body.message,
            message_id: request.body.message_id
        }
        var userMsg = {
            user1: request.user._id, 
            user2: request.params.user_id 
        }

        UserMessage.findByIdAndUpdate(body.message_id,{$set:{text1: body.message, iconUpd: true}},{new: true}).then(async (res)=>{
            if(!res){
                response.status(404).json()
            }

            var thisMessages = []
            var allMsges = await UserMessage.find();
            allMsges.map( (msg) => { 
                if( (msg.user1 == userMsg.user1 && msg.user2 == userMsg.user2) || (msg.user1 == userMsg.user2 && msg.user2 == userMsg.user1)  ){
                    
                thisMessages.push(msg)
                }
            } ) 
            
            localEvent.emit('userMessages',thisMessages.length)
            response.status(200).json()
        }).catch((e)=>{
            console.log(e);
            response.status(400).json()
        })
    } )
    .get( checkAuth, async function(request,response){

        var userMsg = {
            user1: request.user._id, 
            user2: request.params.user_id 
        } 

        var thisMessages = []
        var allMsges = await UserMessage.find();
        allMsges.map( (msg) => { 
            if( (msg.user1 == userMsg.user1 && msg.user2 == userMsg.user2) || (msg.user1 == userMsg.user2 && msg.user2 == userMsg.user1)  ){
                
            thisMessages.push(msg)
            }
        } ) 
        
        response.status(200).json({ messages: thisMessages })
    })
    .delete(checkAuth, async function(request,response){
        var message_id = request.params.user_id;

        var userMsg = {
            user1: request.user._id, 
            user2: request.params.user_id 
        }

        UserMessage.findByIdAndRemove(message_id).then(async (res)=>{
            if(!res){
                response.status(404).json()
            }

            var thisMessages = []
            var allMsges = await UserMessage.find();
            allMsges.map( (msg) => { 
                if( (msg.user1 == userMsg.user1 && msg.user2 == userMsg.user2) || (msg.user1 == userMsg.user2 && msg.user2 == userMsg.user1)  ){
                    
                thisMessages.push(msg)
                }
            } ) 
            
            localEvent.emit('userMessages',thisMessages.length)
            response.status(200).json()
        }).catch((e)=>{
            console.log(e);
            response.status(400).json()
        })
    });
router.route('/user/MsgesWithUsers/:token')
    .get(checkAuth, async function(request,response) {
        var user = request.user;
        var users = []

        UserMessage.find().then(async (messages)=>{
            messages.forEach((message)=>{   
                if( message.user1 == user._id ){
                    if( users.find( u => u.user_id == message.user2 ) === undefined ){
                        users.push({ user_id: message.user2 })
                    }
                }
                else if( message.user2 == user._id ){
                    if( users.find( u => u.user_id == message.user1 ) === undefined ){
                        users.push({ user_id: message.user1 })
                    }
                }
                
            }) 

              for(let i=0;i<users.length;i++){

                users[i].unLooked = await UserMessage.find({ user1: users[i].user_id , user2: user._id, looked: false }).count()
              
            }  
            response.status(200).json({users})
        })
    });

module.exports = router