/**
 * express logger encapsulate
 */

const util = require('../util');
const loggerFormat = ":date :remote-addr :method :url :message :status :res[content-length] :response-time ms";
let logger = require('morgan');

logger.token('date', util.getDateTime);
logger.token('remote-addr', util.getHttpIPv4IP);
logger.token('message', function (req, res) {
    return req.method === "GET" ? "" : JSON.stringify(req.body)
});

module.exports = logger(loggerFormat);
