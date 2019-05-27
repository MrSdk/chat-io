var {UserMessage} =require("./../model/user-msg")

exports.setLooked = async function(data){ 
    return await UserMessage.update({ user1: data.user1, user2: data.user2 },{$set:{looked: true}},{multi: true})
}