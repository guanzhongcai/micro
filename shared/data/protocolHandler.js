/**
 * 服务间通讯消息的处理
 * todo: 消息追踪、监控等
 */

const ProtocolData = require('./ProtocolData');
const utils = require('../util/utils');

module.exports = function (controllers) {

    return function (msg, cb) {

        console.debug(`[protocolHandler] >>> %s, %j`, new Date().toLocaleTimeString(), msg);
        const body = ProtocolData.Parser(msg);
        const [controller, method] = body.api.split(".");
        const c = controllers[controller];
        if (!c) {
            console.error(__filename, `not exist controller=${controller}` + JSON.stringify(body));
            return utils.invokeCallback(cb, null, {code: 500, msg: `not exist controller=${controller}`});
        }
        const func = c[method];
        if (!func) {
            console.error(__filename, `not exist method=${method}` + JSON.stringify(body));
            return utils.invokeCallback(cb, null, {code: 500, msg: `not exist method=${method} in ${controller}`});
        }
        func(body.param, function (err, result) {
            console.debug(`[protocolHandler] <<< %s, %j, %j`, new Date().toLocaleTimeString(), err, result);
            utils.invokeCallback(cb, err, result);
        });
    };
};
