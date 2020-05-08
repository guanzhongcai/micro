/**
 * 错误日志格式
 * @param service string
 * @param url string
 * @param request object
 * @param errMsg string
 * @param err object
 * @returns {{time: number, service: *, url: *, request: *, errMsg: *, err: *}}
 * @constructor
 */
exports.New = function(service, url, request, errMsg, err){

    return {
        time: Date.now(),
        service,
        url,
        request: request || {},
        errMsg: errMsg || "error happen！",
        err,
    }
};
