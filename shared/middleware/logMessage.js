/**
 * 消息debug日志
 */
const reportFormat = require('../metrics/reportFormat');
const command = require('../metrics/command');

/**
 *
 * @param app object server entity
 * @param logFunc function output log handler
 * @returns function
 */
module.exports = function (app, logFunc = console.debug) {

    return function (req, res, next) {

        const msg = req.method === "GET" ? req.query : req.body;
        req.__begintime__ = Date.now();

        let oldWrite = res.write,
            oldEnd = res.end;

        let chunks = [];

        res.write = function (chunk) {
            chunks.push(chunk);

            oldWrite.apply(res, arguments);
        };

        res.end = function (chunk) {
            if (chunk)
                chunks.push(chunk);

            let body;
            if (typeof chunk === "string") {
                body = chunk;
                console.warn(`string chunk::`, __filename, chunk);
            } else {
                body = Buffer.concat(chunks).toString('utf8');
            }
            logFunc(`[LogMessage] %s, %j, 请求= %j, 回应= %s`, req.originalUrl, req.user || {}, msg, body);
            oldEnd.apply(res, arguments);


            //record fail/timeout response
            if (req.method === "GET" && !!req.query.callback) {
                // console.debug(`jsonp request ignored`);
            } else {
                const result = JSON.parse(body);
                if (result.code !== undefined && result.code !== 200) {
                    const report = reportFormat.ErrorInterface(app._serviceId, req, result);
                    app.NotifyMonitor('/error/add', report);
                }

                const span = Date.now() - req.__begintime__;
                if (span > 1000) {
                    const report = reportFormat.Timeout(app._serviceId, req, span);
                    app.NotifyMonitor('/error/add', report);
                }

                command.record(req.originalUrl, span);
            }
            delete req.__begintime__;
        };

        next();
    }
};
