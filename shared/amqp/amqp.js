#!/usr/bin/env node
//todo: create channel in one connection

let amqp = require('amqplib/callback_api');
const MODULE = '[AMQP]';

class Amqp {

    constructor() {
        this._conn = null; //连接
        this._ch = null; //信道
        this._needReconnect = true;
    }
}

/**
 * 连接
 * @param url string
 * @param options object
 * @param cb
 * @constructor
 */
Amqp.prototype.Connect = function (url, options, cb) {

    if (!options) {
        options = {};
    }
    let self = this;
    amqp.connect(url, options, function (err, conn) {
        if (err) {
            console.error("[AMQP]", err);
            return setTimeout(function () {
                self.Connect(url, options, cb);
            }, 1000);
        }

        conn.on("error", function (err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error: ", err);
            }
        });

        conn.on("close", function () {

            self._conn = null;
            if (self._needReconnect) {
                console.error("[AMQP] reconnecting");
                return setTimeout(function () {
                    self.Connect(url, options, cb);
                }, 1000);
            }
        });

        console.debug("[AMQP] connected", url);
        self._conn = conn;

        self.CreateChannel(cb);
    });
};

/**
 * 建立信道
 * @param cb
 * @constructor
 */
Amqp.prototype.CreateChannel = function (cb) {

    let self = this;
    self._conn.createChannel(function (err, ch) {
        if (err) {
            throw new Error(err);
        }

        ch.on("error", function (err) {
            console.error("[AMQP] channel error:", err);
        });

        ch.on("close", function () {
            self._ch = null;
            if (self._needReconnect) {
                console.debug("[AMQP] channel closed");
                console.warn(`[AMQP] channel re-creating!`);
                self.CreateChannel(function (err) {
                    console.debug(`[AMQP] CreateChannel OK`);
                });
            }
        });

        self._ch = ch;
        cb(err);

        //https://www.cloudamqp.com/blog/2015-05-19-part2-2-rabbitmq-for-beginners_example-and-sample-code-node-js.html
        //offlinePubQueue is an internal queue for messages that could not be sent when the application was offline. The application will check this queue and send the messages in the queue if a message is added to the queue.
        /*
        while (true) {
            var [exchange, routingKey, content] = offlinePubQueue.shift();
            publish(exchange, routingKey, content);
        }
         */
    });
};

/**
 * 检测是否连接中
 * @returns {null|*}
 * @constructor
 */
Amqp.prototype.IsConnected = function () {

    return this._conn && this._ch;
};

/**
 * 关闭
 * @param cb
 * @constructor
 */
Amqp.prototype.Close = function (cb) {

    const conn = this._conn;
    this._needReconnect = false;

    this.CloseChannel(function (err) {

        conn.close(function (err) {
            console.debug(`${MODULE} close connection`);
            return cb && cb(null);
        });
    })
};

Amqp.prototype.CloseChannel = function (cb) {
    if (this._ch) {
        this._ch.close(function (err) {
            // console.debug(`${MODULE} close channel`);
            return cb && cb(null);
        });
    } else {
        return cb && cb(null);
    }
};

module.exports = Amqp;

