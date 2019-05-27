const {mongoose} = require("./../db/db")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

var UserSchema = new mongoose.Schema({
    login: {type:String, unique: true},
    password: {type: String},
    username: {type: String},
    avatar: {type: String},
    status: {type: String, default: "I'm Happy😊"},
    ontime: {type: Date}
})  
 
UserSchema.statics.generateHash = function(data){
    return bcrypt.hash(data,10)
}

UserSchema.statics.comparePas = function(current,password) {
    try {
        return bcrypt.compare(current,password)    
    } catch (error) {
        return false
    }   
}

UserSchema.statics.generateAuthToken = function(data){
    return jwt.sign({ login: data.login, password: data.password },'some_key')
}

UserSchema.statics.getThroughToken = function(token) {
    try {
        return jwt.verify(token,'some_key')
    } catch (error) {
        return undefined
    }
}

var User = mongoose.model('user',UserSchema)

module.exports = {User}