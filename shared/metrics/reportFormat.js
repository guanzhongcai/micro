//错误类型
const ERROR_TYPE = {
    system_throw: 1, //系统异常
    interface_fail: 2, //响应失败
    interface_timeout: 3, //指令超时
};

/**
 * 系统错误
 * @param service string
 * @param req object
 * @param err object
 * @returns {{time: number, service: *, url: *, params: *, errMsg: *, err: *}}
 * @constructor
 */
exports.ErrorSystem = function (service, req, err) {

    const params = req.method === "GET" ? req.query : req.body;

    return {
        time: Date.now(),
        type: ERROR_TYPE.system_throw,
        service,
        url: req.originalUrl,
        params: params,
        errMsg: err.message,
        errStack: err.stack,
    }
};

/**
 * 接口错误
 * @param service
 * @param req
 * @param result
 * @returns {{time: number, service: *, url: *, params: *, errMsg, err: *}}
 * @constructor
 */
exports.ErrorInterface = function (service, req, result) {

    const params = req.method === "GET" ? req.query : req.body;

    return {
        type: ERROR_TYPE.interface_fail,
        service,
        url: req.originalUrl,
        params: params,
        result: result,
    }
};

/**
 * 接口超时
 * @param service
 * @param req
 * @param span
 */
exports.Timeout = function (service, req, span) {

    const params = req.method === "GET" ? req.query : req.body;

    return {
        time: Date.now(),
        type: ERROR_TYPE.interface_timeout,
        service,
        url: req.originalUrl,
        params: params,
        span: span,
    }
};
