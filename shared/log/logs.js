/**
 * by gzc 19/11/7
 * 程序中log模块 可分级 可替换console
 */

const {Signale} = require('signale');

let logs = module.exports;
let signale = new Signale();

/**
 * 初始化log级别和格式
 * @param logLevel string warn
 * @param config object {}
 */
logs.init = function (logLevel, config) {

    signale._generalLogLevel = logLevel;
    signale.config(config);
};

logs.info = signale.info;
logs.debug = signale.debug;
logs.success = signale.success;
logs.error = signale.error;
logs.fatal = signale.fatal;
