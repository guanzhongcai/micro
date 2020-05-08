let WorkerProducer = require('../queue').Producer;
const config = require('./config');
let producer = new WorkerProducer(config.queueName);

producer.Connect(config.url, {}, function (err) {

    producer.InitQueue(function (err) {
        let idx = 1;
        setInterval(function () {
            const msg = `msg ${idx++}`;
            console.debug(msg);
            producer.SendToQueue(msg, function (err) {
            })
        }, 1000);
    });
});
