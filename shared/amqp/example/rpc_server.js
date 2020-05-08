const rpc = require('../rpc');
const config = require('./config');

let rpcServer = new rpc.RpcServer(config.queueName);
rpcServer.Connect(config.url, {}, function (err) {
    rpcServer.OnQueue(handler);
});

function handler(msg, cb) {
    console.log(`msg::%j`, msg);
    if (msg.idx % 100 === 0){
        return console.log(`mean no response!`);
    }
    const response = {response: msg.idx * 2};
    cb(null, response);
}
