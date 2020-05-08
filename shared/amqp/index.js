let amqp = require('./amqp');
let pubsub = require('./pubsub');
let queue = require('./queue');
let rpc = require('./rpc');

module.exports = {
    amqp: amqp,
    pubsub: pubsub,
    queue: queue,
    rpc: rpc,
};
