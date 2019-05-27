const localEvent = require("./../utils/localEvent")
const UserMsgController = require("./../controller/user-msg")

module.exports = function(io){
    io.of('/test')
       .on('connection',async (socket)=>{
        console.log("User connected !");
        
            localEvent.on('doorOpen',(data)=>{ 
                socket.emit('countMsg',data)
            }) 
            
            localEvent.on('userMessages',(data)=>{
                socket.emit('countUserMsg',data)
            })

            socket.on('lookedMsg',async (data)=>{ 
                await UserMsgController.setLooked(data)
                io.emit('onLoad',{ success: true })
            })

            socket.on('disconnect',()=>{
                console.log("Front Disconnected !");
            })
    })
}