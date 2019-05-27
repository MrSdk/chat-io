const EventEmitter = require('events');

class MyEmitter extends EventEmitter {};
const myEmitter = new MyEmitter();
myEmitter.setMaxListeners(100);


module.exports = myEmitter;
