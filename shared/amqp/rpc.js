/**
 * by gzc 2020-2-25
 * rabbitMQ rpc client
 */
let Amqp = require('./amqp');
let uuid = require('../util/uuid');

class RpcClient extends Amqp {

    /**
     *
     * @param queue string 名称
     */
    constructor(queue) {
        super();
        this._queue = "rpc:" + queue;
        this._queueObj = null;
        this._map = new Map(); //todo timeout to clear
    }

    InitQueue(cb) {

        const ch = this._ch;
        const self = this;

        function maybeAnswer(msg) {
            const {correlationId} = msg.properties;
            if (correlationId) {
                const cb = self._map.get(correlationId);
                if (cb) {
                    self._map.delete(correlationId);
                    cb(null, msg.content.toString())
                } else {
                    console.warn(`no callback:: %j`, msg);
                }
            }
        }

        ch.assertQueue('', {exclusive: true}, function (err, ok) {
            if (err) {
                return self.Close(cb);
            }
            self._queueObj = ok.queue;
            ch.consume(self._queueObj, maybeAnswer, {noAck: true});
            cb(null);
        });
    };

    Request(msg, cb) {
        if (!this.IsConnected()) {
            console.error("not connected! %j", msg);
            return cb(null, {code: 500, msg: "MQ not connected!"});
        }
        let self = this;
        const ch = this._ch;
        const q = this._queueObj;
        const content = typeof (msg) === "object" ? JSON.stringify(msg) : msg;
        const correlationId = uuid.nextID();

        self._map.set(correlationId, cb);

        const options = {
            replyTo: q,
            correlationId,
            expiration: 2 * 3600 * 1000, //unit：ms
            deliveryMode: 2, //1/2 transient/persistent
        };
        ch.sendToQueue(self._queue, Buffer.from(content), options);
    };
}


class RpcServer extends Amqp {

    /**
     *
     * @param queue string 名称
     */
    constructor(queue) {
        super();
        this._queue = "rpc:" + queue;
    }

    OnQueue(handler) {

        const ch = this._ch;
        const q = this._queue;
        const self = this;

        ch.assertQueue(q, {durable: false});
        ch.prefetch(100);
        ch.consume(q, reply, {noAck: false}, function (err) {
            if (err) {
                return self.Close();
            }
            console.debug(' [x] Awaiting RPC requests');
        });

        function reply(msg) {
            const content = msg.content.toString();

            const timer = setTimeout(function () {
                console.error("回应超时！", content);
                const result = {code: 500, msg: "rpc_fail!"};
                ch.sendToQueue(msg.properties.replyTo,
                    Buffer.from(JSON.stringify(result)),
                    {correlationId: msg.properties.correlationId});
                ch.ack(msg);
            }, 1500);

            handler(JSON.parse(content), function (err, response) {
                const result = typeof (response) === "object" ? JSON.stringify(response) : response;
                ch.sendToQueue(msg.properties.replyTo,
                    Buffer.from(result),
                    {correlationId: msg.properties.correlationId});
                ch.ack(msg);
                clearTimeout(timer);
            });
        }
    }
}

module.exports = {RpcClient, RpcServer};
