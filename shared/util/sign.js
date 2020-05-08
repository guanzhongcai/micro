/**
 * 签名检查 by gzc 19.8.12
 */

const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const SALT = "gosecret98b36e97159eaa9cbf8aaa35";

const ExcludeKeys = [
    "__sign",
    "callback", //jsonp
    "_",
];

/**
 * 获取签名
 * @param msg object
 */
exports.getSign = function(msg) {

    let arrKey = [];
    for (let key in msg) {
        if (ExcludeKeys.includes(key)) { //去除签名值参数 & jsonp附加参数
            continue;
        }
        arrKey.push(key);
    }

    arrKey = arrKey.sort();
    //console.log(arrKey);

    let str = "";
    for (let key of arrKey) {
        let val = msg[key];
        if (typeof (val) === "object"){
            //todo true or number will has double quotes 双引号
            val = JSON.stringify(val);
        }
        str += val + "#";
    }
    str += SALT;


    let md5 = crypto.createHash('md5');
    md5.update(str);
    const sign = md5.digest('hex');
    // console.debug(`str:: ${str}`);

    return sign;
};

/**
 * 增加时间戳和md5签名值
 * @param msg object
 * @returns {*}
 */
exports.addSign = function(msg) {

    msg.__timestamp = Date.now();
    msg.__sign = exports.getSign(msg);

    return msg;
};

/**
 * 创建json web token
 * @param obj object 对象
 * @param expire number 超时时间 单位秒
 * @param secret string 密钥串
 * @returns string token
 */
exports.jwtCreateToken = function(obj, expire, secret){
    if (!obj) {
        console.debug(obj);
        throw `param error`
    }
    const options = {
        exp: Math.floor(Date.now() / 1000) + Number(expire),
    };
    Object.assign(options, obj);
    return jwt.sign(options, secret);
};

