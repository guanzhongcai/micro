const mq = require('./mq.js');

exports.initDB = function (cb) {

    mq.Init(cb);
};

exports.Close = function (cb) {

    mq.Close(cb);
};

