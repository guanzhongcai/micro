#!/usr/bin/env node
/**
 * 多个消费者一起工作，分流消费一个消息队列
 * author by gzc 2020.2.24
 */

let Amqp = require('./amqp');

/**
 * 生产者
 */
class Producer extends Amqp {

    /**
     *
     * @param queue string 名称
     */
    constructor(queue) {
        super();
        this._queue = queue;
    }

    InitQueue(cb) {

        let self = this;
        let ch = self._ch;
        let queue = self._queue;
        ch.assertQueue(queue, {durable: true}, function (err) {
            if (err) {
                return self.Close(cb);
            }
            cb(err);
        })
    }

    SendToQueue(msg) {
        if (!this.IsConnected()){
            return console.error("not connected! %j", msg);
        }
        const ch = this._ch;
        const queue = this._queue;
        const content = typeof (msg) === "object" ? JSON.stringify(msg) : msg;
        const buff = Buffer.from(content);
        ch.sendToQueue(queue, buff, {persistent: true});
    }
}

/**
 * 消费者
 */
class Consumer extends Amqp {

    /**
     *
     * @param queue string 名称
     */
    constructor(queue) {
        super();
        this._queue = queue;
    }

    /**
     * 等待队列消息
     * @param handler function(msg) msg is string
     * @constructor
     */
    OnQueue(handler) {
        let self = this;
        const ch = self._ch;
        const q = self._queue;
        ch.assertQueue(q, {durable: true}, function (err) {

            function doWork(msg) {
                const body = msg.content.toString();
                ch.ack(msg);
                handler(body);
            }

            ch.consume(q, doWork, {noAck: false});
        })
    }
}

module.exports = {Producer, Consumer};

