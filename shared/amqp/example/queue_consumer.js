let WorkerConsumer = require('../queue').Consumer;
const config = require('./config');
let consumer = new WorkerConsumer(config.queueName);
consumer.Connect(config.url, {}, function (err) {

    function handler(msg){
        console.log(`msg::`, msg);
    }
    consumer.OnQueue(handler);
});
