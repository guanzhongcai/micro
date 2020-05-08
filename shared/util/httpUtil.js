/**
 * Created by gonglei on 17/4/6.
 */

var http = require('http');
var utils = require('./utils');
var Code = require('../code');

var httpUtil = module.exports;

/**
 * http get request
 * */
httpUtil.httpGet = function (host, port, path, cb) {

    if (path[0] !== '/') {
        path = '/' + path;
    }
    var options = {
        hostname: host,
        port: port,
        path: path,
        method: 'GET'
    };

    //console.log(options);
    var timeoutEventId;
    var req = http.request(options, function (res) {
        //console.log("statusCode: ", res.statusCode);
        //console.log("headers: ", res.headers);

        var str = '';
        res.on('data', function (chunk) {
            clearTimeout(timeoutEventId);
            //console.log('BODY:: ' + chunk);
            str += chunk;
        });

        res.on('end', function () {
            //console.log(str);
            utils.invokeCallback(cb, null, JSON.parse(str));
        });
    });

    req.end();

    req.on('error', function (e) {
        clearTimeout(timeoutEventId);
        console.log('problem with request: ' + e.message);
        utils.invokeCallback(cb, e, null);
    });

    req.on('timeout', function (e) {
        req.abort(e);
    })

    req.on('end', function () {

    });

    timeoutEventId = setTimeout(function () {
        req.emit('timeout', {message: 'have been timeout...'});
    }, 3000);
};

httpUtil.httpPost = function (host, port, path, msg, cb) {
    var reqdata = msg;
    var msgBuffer;
    if (typeof (reqdata) === 'object') {
        reqdata = JSON.stringify(msg);
        msgBuffer = Buffer.from(JSON.stringify(msg));
    } else {
        msgBuffer = Buffer.from(msg);
    }

    var options = {
        hostname: host,
        port,
        path,
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            "Content-Length": msgBuffer.length
        }
    };
    var timeoutEventId;
    //console.log('options::', JSON.stringify(options), reqdata);
    var request = http.request(options, function (response) {
        //console.log('STATUS: ' + response.statusCode);
        response.setEncoding('utf8');

        var rspdata = '';
        response.on('data', function (chunk) {
            //console.log('chunk::', chunk);
            rspdata += chunk;
        });

        response.on('end', function () {
            clearTimeout(timeoutEventId);
            //console.log('http请求返回结果:', rspdata);
            //rspdata = JSON.parse(rspdata);
            utils.invokeCallback(cb, null, rspdata);
        });
    });

    request.write(reqdata, 'utf8');
    request.end();

    request.on('error', function (err) {
        clearTimeout(timeoutEventId);
        console.log('problem with request: ', err.message, JSON.stringify(options));
        utils.invokeCallback(cb, err, JSON.stringify({code: Code.FAIL, msg: Code.msg.http_post_error}));
        throw err;
    });

    request.on('timeout', function (e) {
        request.abort(e);
    });

    timeoutEventId = setTimeout(function () {
        request.emit('timeout', {message: 'have been timeout...'});
    }, 3000);

};

httpUtil.getHttpMsg = function (req) {

    switch (req.method) {
        case "GET":
            return req.query;

        case "POST":
            return req.body;

        default:
            console.error('暂不支持的http方法！');
            break;
    }

    return null;
};


/**
 * Get request IP address.
 *
 * @private
 * @param {IncomingMessage} req
 * @return {string}
 */

function getip(req) {
    return req.ip
        || req._remoteAddress
        || (req.connection && req.connection.remoteAddress)
        || undefined;
}

/**
 * 获取IPv4 IP
 * @param req object
 * @returns {string}
 */
httpUtil.getHttpIPv4IP = function (req) {

    const ip = getip(req);
    if (!!ip) {
        const array = ip.split('::ffff:');
        if (array.length > 0) {
            return array[1];
        } else {
            return array[0];
        }
    }
};
