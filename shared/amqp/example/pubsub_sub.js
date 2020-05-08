let Subscriber = require('../pubsub').Subscriber;
const config = require('./config');
let consumer = new Subscriber(config.exchange);
consumer.Connect(config.url, {}, function (err) {
    consumer.OnSub(function (msg) {
        console.log(`body>>>`, msg);
    });
});
