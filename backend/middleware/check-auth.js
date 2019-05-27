var {User} = require("./../model/user")

module.exports = async function(req,res,next) { 
    var token = req.params.token; 

    var thisUser = User.getThroughToken(token)
     
    if(thisUser){
        // console.log(thisUser);
        
        User.findOne({login: thisUser.login, password: thisUser.password}).then((result)=>{
            if(!result){
                res.status(404).json()
            }
    
            req.user = result 
            
            next()
            
        }).catch((e)=>{
            console.log(e);
            res.status(404).json()
        })
    
    }
    else{
        res.status(404).json()
    }
    
}