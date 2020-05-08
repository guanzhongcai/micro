let Publisher = require('../pubsub').Publisher;
const config = require('./config');
let producer = new Publisher(config.exchange);

producer.Connect(config.url, {}, function (err) {
    producer.InitPub(function (err) {


        let idx = 1;
        setInterval(function () {
            const msg = `msg ${idx++}`;
            console.debug(msg);
            producer.PublishMessage(msg);
        }, 1000);
    });

});
