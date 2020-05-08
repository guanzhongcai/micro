const rpc = require('../rpc');
const config = require('./config');

let rpcClient = new rpc.RpcClient(config.queueName);
rpcClient.Connect(config.url, {}, function (err) {
    rpcClient.InitQueue(function (err) {

        let idx = 1;
        let obj = {key: 123};
        setInterval(function () {
            console.debug(`request:`, {idx: idx++});
            rpcClient.Request({idx: obj}, function (err, response) {
                // obj.key = null;
                console.debug(`response:`, err, response, obj.key);
            })
        }, 1000);
    })
});


process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err.message + err.stack + err.transition);
});
