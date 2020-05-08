#!/usr/bin/env node

let Amqp = require('./amqp');

class Publisher extends Amqp {

    /**
     *
     * @param exchange string 名称
     */
    constructor(exchange) {
        super();
        this._exchange = "ex:" + exchange;
    }

    InitPub(cb) {
        if (!this._conn || !this._ch) {
            throw 'not connected!';
        }
        const ch = this._ch;
        const ex = this._exchange;
        ch.assertExchange(ex, 'fanout', {durable: false}, cb);
    }

    PublishMessage(message) {
        if (!this.IsConnected()){
            return console.error("not connected! %j", message);
        }
        const ch = this._ch;
        const ex = this._exchange;
        const msg = typeof (message) === "object" ? JSON.stringify(message) : message;
        ch.publish(ex, '', Buffer.from(msg));
    }
}

class Subscriber extends Amqp {

    /**
     *
     * @param exchange string 名称
     */
    constructor(exchange) {
        super();
        this._exchange = "ex:" + exchange;
    }

    /**
     * 等待队列消息
     * @param handler function(msg) msg is string
     * @constructor
     */
    OnSub(handler) {
        const ex = this._exchange;
        const ch = this._ch;
        const self = this;

        ch.assertExchange(ex, 'fanout', {durable: false}, function (err) {

            ch.assertQueue("", {exclusive: true}, function (err, ok) {
                if (err) {
                    throw err;
                }
                const q = ok.queue;
                ch.bindQueue(q, ex, '');
                ch.consume(q, logMessage, {noAck: true}, function (err, ok) {
                    if (err !== null) {
                        return self.Close();
                    }
                    console.debug(` [*] Waiting for publish messages.`);
                });

                function logMessage(msg) {
                    if (msg) {
                        const content = msg.content.toString();
                        // console.debug(" [x] '%s'", content);
                        handler(content);
                    }
                }
            });
        });
    }
}

module.exports = {Publisher, Subscriber};
