const express = require("express")
const localEvent = require("./../utils/localEvent")

var {Chat} = require("./../model/chat")
var check_auth = require("./../middleware/check-auth")
var router = express.Router()
// const io = require("socket.io").sockets

// io.of('/test')
//     .on('connection',async (socket)=>{
        
//         // myEmitter.on('doorOpen',()=>{
//         //     console.log("Hi bro");
            
//         // })
//         socket.on('mmm',()=>{
//             console.log("SSSSS");
            
//         })

//         socket.on('disconnect',()=>{
//             console.log("Front Disconnected !");
//         })
//     })

router.route('/message/:token')
    .post(check_auth, async function(request,response) { 

        var body = request.body;
        var newMsg = new Chat({
            message: body.message,
            date: body.date,
            user_id: request.user._id
        })

        newMsg.save().then(async (res)=>{
            localEvent.emit('doorOpen',await Chat.find().count())
            response.status(200).json()
        }).catch(e=>{
            console.log(e);
            response.status(400).json()
        })
    })
    .patch(check_auth, async function(request,response){
        var body = {
            message: request.body.message,
            message_id: request.body.message_id
        }

        Chat.findByIdAndUpdate(body.message_id,{$set:{message: body.message, iconUpd: true}},{new: true}).then(async (res)=>{
            if(!res){
                response.status(404).json()
            }

            localEvent.emit('doorOpen',await Chat.find().count())
            response.status(200).json()
        }).catch((e)=>{
            console.log(e);
            response.status(400).json()
        })
    } );
router.route('/message/:token/:id')
        .delete(check_auth, async function(request,response){
            var message_id = request.params.id;

            Chat.findByIdAndRemove(message_id).then(async (res)=>{
                if(!res){
                    response.status(404).json()
                }

                localEvent.emit('doorOpen',await Chat.find().count())
                response.status(200).json()
            }).catch((e)=>{
                console.log(e);
                response.status(400).json()
            })
        });
router.route('/messages')
    .get(async function(request,response){
        var messages = await Chat.find();
        response.status(200).json({messages})
    });

module.exports = router