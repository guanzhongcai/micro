/**
 * 中间件 by gzc 19.8.12
 */

const goUtil = require('../util');
const MAX_DIFF_TIME = 60 * 5; //请求时间戳最大时间差值
require('../code');
const checkSign = require('debug')('checkSign');

/**
 * express的签名检查
 * @param req
 * @param res
 * @param next
 */
module.exports = function (req, res, next) {

    let msg = req.method === "GET" ? req.query : req.body;
    checkSign("%j", msg);

    function send(statusCode, msg) {

        console.debug(`checkSign statusCode=${statusCode}, %j`, msg, req.path, req.query, req.body);
        if (req.is("application/x-protobuf")) {
            res.status(statusCode).protobuf({code: statusCode, msg});
        } else {
            // res.status(500).send({code: 500, msg});
            res.status(statusCode).send({code: statusCode, msg});
        }
    }

    const {__timestamp, __sign} = msg;

    //时间戳检查
    if (!__timestamp) {
        return send(HTTP_STATUS.Bad_Request, "时间戳字段缺失");
    } else {
        const diff = Math.abs(new Date().getTime() - __timestamp);
        if (diff > MAX_DIFF_TIME * 1000) {
            return send(HTTP_STATUS.Bad_Request, `过期的客户端请求！(${diff / 1000}秒前的请求)`);
        }
    }

    //签名检查
    if (!__sign) {
        return send(HTTP_STATUS.Token_Required, "签名字段缺失");
    }

    const sign = goUtil.getSign(msg);
    if (__sign === sign) {
        delete msg.__timestamp;
        delete msg.__sign;
        next();
    } else {
        console.debug(`sign=${sign}, __sign=${__sign}`);
        return send(HTTP_STATUS.Unauthorized, "错误的签名");
    }
};

