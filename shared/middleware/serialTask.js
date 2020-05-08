/**
 * keep request sequence per client
 * 基于每个玩家的消息做排队，如果前面的请求没处理完，后面的请求就至多等待一个超时时间后再处理
 */

const taskManager = require('pomelo/lib/common/manager/taskManager');

/**
 * 导出中间件
 * @param timeoutMs 超时时间 毫秒
 * @returns {Function} 中间件函数
 */
module.exports = function (timeoutMs) {

    return function (req, res, next) {

        const {uid} = req.user || {};
        if (!uid) {
            return next();
        }

        taskManager.addTask(uid,
            function (task) {
                next();
            },
            function () { //on timeout handler
            }, timeoutMs);
    }
};
