const {mongoose} = require("../db/db")

var UserMessageSchema = new mongoose.Schema({
    user1: {type: String},
    text1: {type: String},
    user2: {type: String},
    date: {type: Date},
    iconUpd: {type: Boolean,default: false},
    looked: {type: Boolean, default: false}
})

var UserMessage = mongoose.model('user-msg',UserMessageSchema)

module.exports = {UserMessage}