const http = require("http");
const https = require('https');
const socketIO = require('socket.io');
const app = require("./backend/app");
const debug = require("debug")("node-angular");
const fs = require('fs');

// var eventEmitter = new events.EventEmitter();



// const localEvent = require("./backend/utils/localEvent")
const normalizePort = val => {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

const onError = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const onListening = () => {
    const addr = server.address();
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "8080");
app.set("port", port);

// const EventEmitter = require('events');

// class MyEmitter extends EventEmitter {};
// const myEmitter = new MyEmitter();
// myEmitter.setMaxListeners(100);

const server = http.createServer(app);
var io = socketIO(server);

require("./backend/utils/socket")(io)

server.on("error", onError);
server.on("listening", onListening);
server.listen(port,()=>{ 
            // localEvent.emit('message',"Congratulations !!!")
    console.log(`Server running on port ${port}`);
});
