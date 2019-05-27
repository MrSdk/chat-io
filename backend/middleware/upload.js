const multer = require("multer")

const MIME_TYPE_MAP = {
    "image/png": 'png',
    "image/jpg": 'jpg',
    "image/jpeg": 'jpeg',
}

var storage = multer.diskStorage({
    destination: function(req,file,cb){
        var error = null;
        var ext = MIME_TYPE_MAP[file.mimetype]
        if(!ext){
            error = "this type of file incorrect for us"
        }

        cb(error,__dirname + '/../uploads/')
    },
    filename: function(req,file,cb){
        var error = null;
        var ext = MIME_TYPE_MAP[file.mimetype]
        if(!ext){
            error = "this type of file incorrect for us"
        }
        
        cb(error,file.fieldname + " - " + Date.now() + "." + ext)
    }
})

module.exports = multer({storage: storage}).single('avatar')