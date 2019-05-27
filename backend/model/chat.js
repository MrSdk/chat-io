const {mongoose} = require("./../db/db")

var ChatSchema = new mongoose.Schema({
    user_id: {type: String},
    message: {type: String},
    date: {type: Date},
    iconUpd: {type: Boolean,default: false}
});
var Chat = mongoose.model('chat',ChatSchema)

module.exports = {Chat}