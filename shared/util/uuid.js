/**
 * UUID 通用唯一识别码（Universally Unique Identifier）
 */

const toDate = require('twitter-snowflake-to-date');
const intformat = require('biguint-format');
const FlakeId = require('flake-idgen');

const flakeIdGen = new FlakeId({
    epoch: 1288834974657, //same to TWITTER_START_EPOCH
    datacenter: 9, //IDC机房ID
    worker: 7 //服务序号ID
});

/**
 * 返回分布式ID
 * @returns {string}
 */
exports.nextID = function (){

    return intformat(flakeIdGen.next(), 'dec');
};

/**
 * 返回分布式ID
 * @returns {number}
 */
exports.nextNumberID = function (){

    return Number(intformat(flakeIdGen.next(), 'dec'));
};

exports.getDateTime = function (uuid_str) {

    return new Date(toDate.twitterSnowflakeToDate(uuid_str.toString())).toLocaleString();
};
